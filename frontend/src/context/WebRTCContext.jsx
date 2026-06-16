import { createContext, useContext, useEffect, useRef, useState } from "react";

import { SocketContext } from "./SocketContext";

export const WebRTCContext = createContext();

export const WebRTCProvider = ({ children }) => {
  const { socket, roomId } = useContext(SocketContext);
  const [localStream, setLocalStream] = useState(null);
  const [remoteStream, setRemoteStream] = useState(null);

  const pendingCandidates = useRef([]);

  const peerRef = useRef(null);

  // CREATE PEER
  const createPeerConnection = () => {
    const peer = new RTCPeerConnection({
      iceServers: [
        {
          urls: "stun:stun.l.google.com:19302",
        },
      ],
    });

    peer.ontrack = (event) => {
      console.log("Remote stream received");

      const stream = event.streams[0];

      setRemoteStream(stream);
    };

    peer.onicecandidate = (event) => {
      if (event.candidate) {
        socket?.emit("ice-candidate", {
          roomId,
          candidate: event.candidate,
        });

        console.log("ICE candidate sent");
      }
    };

    peer.onconnectionstatechange = () => {
      console.log("Connection:", peer.connectionState);
    };

    peerRef.current = peer;

    return peer;
  };

  // START CAMERA
  const startLocalStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setLocalStream(stream);

      const peer = createPeerConnection();

      stream.getTracks().forEach((track) => {
        peer.addTrack(track, stream);
      });

      console.log("Local stream started");
    } catch (error) {
      console.log(error);
    }
  };

  // SOCKET EVENTS
  useEffect(() => {
    if (!socket || !roomId) return;

    // START CALL
    socket.on("start-call", async () => {
      console.log("Start call received");

      // wait until peer exists
      if (!peerRef.current) {
        createPeerConnection();
      }

      const peer = peerRef.current;

      // add tracks if missing
      if (localStream) {
        localStream.getTracks().forEach((track) => {
          const alreadyAdded = peer
            .getSenders()
            .some((sender) => sender.track === track);

          if (!alreadyAdded) {
            peer.addTrack(track, localStream);
          }
        });
      }

      // avoid duplicate offer
      if (peer.signalingState !== "stable") return;

      const offer = await peer.createOffer();

      await peer.setLocalDescription(offer);

      socket.emit("webrtc-offer", {
        roomId,
        offer,
      });

      console.log("Offer sent");
    });
    // RECEIVE OFFER
    socket.on("webrtc-offer", async ({ offer }) => {
      console.log("Offer received");

      let stream = localStream;

      // start camera if not started
      if (!stream) {
        stream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        });

        setLocalStream(stream);

        console.log("Local stream started before answer");
      }

      // create peer if not exists
      if (!peerRef.current) {
        createPeerConnection();
      }

      const peer = peerRef.current;

      // add tracks
      stream.getTracks().forEach((track) => {
        const alreadyAdded = peer
          .getSenders()
          .some((sender) => sender.track === track);

        if (!alreadyAdded) {
          peer.addTrack(track, stream);
        }
      });

      // IMPORTANT: set remote offer first
      await peer.setRemoteDescription(new RTCSessionDescription(offer));

      // add queued ICE
      for (const candidate of pendingCandidates.current) {
        await peer.addIceCandidate(new RTCIceCandidate(candidate));
      }

      pendingCandidates.current = [];

      // now create answer
      const answer = await peer.createAnswer();

      await peer.setLocalDescription(answer);

      socket.emit("webrtc-answer", {
        roomId,
        answer,
      });

      console.log("Answer sent");
    });
    // RECEIVE ANSWER
    socket.on("webrtc-answer", async ({ answer }) => {
      console.log("Answer received");

      if (peerRef.current.signalingState === "have-local-offer") {
        await peerRef.current.setRemoteDescription(
          new RTCSessionDescription(answer),
        );

        // flush queued ICE
        for (const candidate of pendingCandidates.current) {
          await peerRef.current.addIceCandidate(new RTCIceCandidate(candidate));
        }

        pendingCandidates.current = [];
      }
    });

    // ICE
    socket.on("ice-candidate", async ({ candidate }) => {
      try {
        const peer = peerRef.current;

        if (!peer) return;

        // remote description not ready yet
        if (!peer.remoteDescription) {
          pendingCandidates.current.push(candidate);

          console.log("ICE queued");
          return;
        }

        await peer.addIceCandidate(new RTCIceCandidate(candidate));

        console.log("ICE received");
      } catch (error) {
        console.log(error);
      }
    });

    return () => {
      socket.off("start-call");

      socket.off("webrtc-offer");

      socket.off("webrtc-answer");

      socket.off("ice-candidate");
    };
  }, [socket, roomId]);

  const stopCall = () => {
    localStream?.getTracks().forEach((track) => track.stop());

    remoteStream?.getTracks().forEach((track) => track.stop());

    peerRef.current?.close();

    peerRef.current = null;

    setLocalStream(null);
    setRemoteStream(null);

    console.log("Call stopped");
  };

  return (
    <WebRTCContext.Provider
      value={{
        localStream,
        remoteStream,
        startLocalStream,
        stopCall,
      }}
    >
      {children}
    </WebRTCContext.Provider>
  );
};
