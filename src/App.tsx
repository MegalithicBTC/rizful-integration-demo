import "./App.css";
import { useState } from "react";
import { openPopup, isValidHex, getRizfulOrigin } from "./utils/utils";

export default function App() {
  // Get RIZFUL_ORIGIN from .env if available, otherwise default to rizful.com
  const rizfulOrigin = getRizfulOrigin();
  const tokenExchangeEndpoint = `${rizfulOrigin}/nostr_onboarding_auth_token/post_for_secrets`;

  // State for the form
  const [code, setCode] = useState("");
  const [hexKey, setHexKey] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [nwc, setNwc] = useState<string | null>(null);
  const [lnaddr, setLnaddr] = useState<string | null>(null);
  const [returnedNpub, setReturnedNpub] = useState<string | null>(null);

  const openSignupPage = () => {
    openPopup(`${rizfulOrigin}/create-account`, "rizful_signup");
  };

  const openCodesPage = () => {
    openPopup(
      `${rizfulOrigin}/nostr_onboarding_auth_token/get_token`,
      "rizful_codes"
    );
  };

  const tokenExchange = async () => {
    setBusy(true);
    setErr(null);
    setNwc(null);
    setLnaddr(null);

    try {
      const r = await fetch(tokenExchangeEndpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "omit",
        body: JSON.stringify({
          secret_code: code.trim(),
          nostr_public_key: hexKey.trim(),
        }),
      });

      if (!r.ok) {
        const errorText = await r.text();
        throw new Error(errorText || "Exchange failed");
      }

      const j = await r.json();

      // Console log the full response from Rizful server
      console.log("📥 Response from Rizful server:", j);
      console.log("🔍 Response keys:", Object.keys(j));
      console.log("📊 Response structure:", JSON.stringify(j, null, 2));

      setNwc(j.nwc_uri ?? null);
      setLnaddr(j.lightning_address ?? null);
      setReturnedNpub(j.nostr_public_key ?? null);
    } catch (e: unknown) {
      setErr(e instanceof Error ? e.message : String(e));
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <h1>Quickly Get NWC and Lightning Address From Rizful (demo)</h1>
      <div className="card">
        <div style={{ display: "grid", gap: "2rem", justifyItems: "center" }}>
          {/* Signup Button */}
          <div style={{ textAlign: "center" }}>
            <h3>New to Rizful?</h3>
            <button
              onClick={openSignupPage}
              style={{
                padding: "12px 24px",
                fontSize: "16px",
                backgroundColor: "#FF9800",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
              }}
            >
              Sign up for Rizful
            </button>
          </div>

          {/* Main Flow */}
          <div
            style={{
              display: "grid",
              gap: 12,
              justifyItems: "center",
              maxWidth: "500px",
              margin: "0 auto",
            }}
          >
            <div style={{ textAlign: "center" }}>
              <h3>Get Your One-Time Code</h3>
              <button
                onClick={openCodesPage}
                style={{
                  padding: "12px 24px",
                  fontSize: "16px",
                  backgroundColor: "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                }}
              >
                Get Code
              </button>
            </div>

            <div style={{ textAlign: "center", width: "100%" }}>
              <h3>Enter Your Code</h3>
              <div style={{ marginBottom: "16px" }}>
                <input
                  placeholder="Paste your one-time code here"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  style={{
                    width: "480px",
                    maxWidth: "90%",
                    padding: "12px",
                    fontSize: "14px",
                    fontFamily: "monospace",
                    border: "1px solid #ccc",
                    borderRadius: "6px",
                    marginBottom: "8px",
                  }}
                />
              </div>
              <div style={{ marginBottom: "16px" }}>
                <input
                  placeholder="18a10b21377d7843c794aef8282ef64c0eae2c7aafea2088ecb4d7c1d0faf257 (your Nostr public key in hex format)"
                  value={hexKey}
                  onChange={(e) => setHexKey(e.target.value)}
                  style={{
                    width: "480px",
                    maxWidth: "90%",
                    padding: "12px",
                    fontSize: "14px",
                    fontFamily: "monospace",
                    border:
                      !hexKey.trim() || isValidHex(hexKey.trim())
                        ? "1px solid #ccc"
                        : "2px solid #ff6b6b",
                    borderRadius: "6px",
                    marginBottom: "8px",
                  }}
                />
                <p
                  style={{
                    fontSize: "14px",
                    color: "#666",
                    marginBottom: "16px",
                  }}
                >
                  For this demo, you are asked to paste in a hex formatted Nostr
                  public key. In a real app, the app would provide the hex
                  public key and POST it to the server along with the one-time
                  code.
                </p>
                <br />
              </div>
              <button
                onClick={tokenExchange}
                disabled={
                  busy ||
                  !code.trim() ||
                  !hexKey.trim() ||
                  !isValidHex(hexKey.trim())
                }
                style={{
                  padding: "12px 24px",
                  fontSize: "16px",
                  backgroundColor:
                    busy ||
                    !code.trim() ||
                    !hexKey.trim() ||
                    !isValidHex(hexKey.trim())
                      ? "#ccc"
                      : "#4CAF50",
                  color: "white",
                  border: "none",
                  borderRadius: "6px",
                  cursor:
                    busy ||
                    !code.trim() ||
                    !hexKey.trim() ||
                    !isValidHex(hexKey.trim())
                      ? "not-allowed"
                      : "pointer",
                }}
              >
                {busy ? "Getting secrets..." : "Get Secrets"}
              </button>
            </div>

            {err && (
              <div
                style={{
                  color: "crimson",
                  backgroundColor: "#fee",
                  padding: "12px",
                  borderRadius: "6px",
                  textAlign: "center",
                }}
              >
                {err}
              </div>
            )}

            {(nwc || lnaddr || returnedNpub) && (
              <div
                style={{
                  fontFamily: "monospace",
                  padding: "16px",
                  borderRadius: "8px",
                  border: "2px solid #4CAF50",
                  width: "100%",
                }}
              >
                <h4 style={{ color: "#4CAF50", marginTop: 0 }}>✅ Success!</h4>
                {nwc && (
                  <div style={{ marginBottom: "8px", wordBreak: "break-all" }}>
                    <strong>NWC URI:</strong> {nwc}
                  </div>
                )}
                {lnaddr && (
                  <div style={{ wordBreak: "break-all" }}>
                    <strong>Lightning Address:</strong> {lnaddr}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
