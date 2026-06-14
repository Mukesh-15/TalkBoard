import { useRef, useState, useEffect } from "react";

export default function OtpVerification({ length = 6, onVerify }) {
  const [values, setValues] = useState(Array(length).fill(""));
  const [verified, setVerified] = useState(false);
  const [toast, setToast] = useState("");
  const [resendTimer, setResendTimer] = useState(0);
  const inputs = useRef([]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const t = setTimeout(() => setResendTimer(r => r - 1), 1000);
    return () => clearTimeout(t);
  }, [resendTimer]);

  const update = (i, val) => {
    const next = [...values];
    next[i] = val.replace(/\D/g, "")[0] ?? "";
    setValues(next);
    if (next[i] && i < length - 1) inputs.current[i + 1]?.focus();
  };

  const onKeyDown = (i, e) => {
    if (e.key === "Backspace" && !values[i] && i > 0) inputs.current[i - 1]?.focus();
    if (e.key === "ArrowLeft"  && i > 0) inputs.current[i - 1]?.focus();
    if (e.key === "ArrowRight" && i < length - 1) inputs.current[i + 1]?.focus();
  };

  const onPaste = (e) => {
    e.preventDefault();
    const text = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    const next = Array(length).fill("");
    [...text].forEach((ch, idx) => (next[idx] = ch));
    setValues(next);
    inputs.current[Math.min(text.length, length - 1)]?.focus();
  };

  const handleConfirm = () => {
    const code = values.join("");
    if (code.length < length) {
      const empty = values.findIndex(v => !v);
      inputs.current[empty]?.focus();
      setToast("Please enter all 4 digits");
      return;
    }
    setVerified(true);
    onVerify?.(code);
    setTimeout(() => {
      setVerified(false);
      setValues(Array(length).fill(""));
      inputs.current[0]?.focus();
    }, 2000);
  };

  const handleResend = (e) => {
    e.preventDefault();
    if (resendTimer > 0) return;
    setResendTimer(30);
    setToast("Code resent to your email");
  };

  const filled = (i) => !!values[i];

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8 w-150">
        <h2 className="text-lg font-semibold text-gray-900 mb-1">Verification code</h2>
        <p className="text-sm text-gray-400 leading-relaxed mb-6">
          We have sent the verification code to your email address
        </p>

        <div className="flex gap-3 justify-center mb-7" onPaste={onPaste}>
          {values.map((val, i) => (
            <input
              key={i}
              ref={el => (inputs.current[i] = el)}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={val}
              onChange={e => update(i, e.target.value)}
              onKeyDown={e => onKeyDown(i, e)}
              className={`
                w-14 h-16 text-center text-2xl font-medium rounded-xl border-[1.5px] outline-none
                bg-gray-50 text-gray-900 transition-colors
                ${filled(i) ? "border-orange-500" : "border-gray-200"}
                focus:border-orange-500 focus:bg-white
              `}
            />
          ))}
        </div>

        <button
          onClick={handleConfirm}
          className={`
            w-full h-12 rounded-full text-white font-semibold text-sm transition-all
            ${verified ? "bg-emerald-500" : "bg-orange-500 hover:bg-orange-600 active:scale-[0.98]"}
          `}
        >
          {verified ? "✓ Verified!" : "Confirm"}
        </button>

        <p className="text-center text-sm text-gray-400 mt-4">
          Didn't receive code?{" "}
          <button
            onClick={handleResend}
            disabled={resendTimer > 0}
            className={`font-semibold transition-colors ${resendTimer > 0 ? "text-gray-400 cursor-default" : "text-orange-500 hover:text-orange-600"}`}
          >
            {resendTimer > 0 ? `Resend (${resendTimer}s)` : "Resend"}
          </button>
        </p>
      </div>

      {toast && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-5 py-2.5 rounded-full shadow-lg animate-fade-in whitespace-nowrap">
          {toast}
        </div>
      )}
    </div>
  );
}