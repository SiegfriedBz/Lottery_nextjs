import { useMoralis } from "react-moralis"
import { useEffect } from "react"
import clsx from "clsx"

export default function ManualHeader(params) {
  const {
    enableWeb3,
    isWeb3Enabled,
    deactivateWeb3,
    isWeb3EnableLoading,
    Moralis,
    account,
  } = useMoralis()

  useEffect(() => {
    if (isWeb3Enabled) return
    if (typeof window != "undefined") {
      if (window.localStorage.getItem("connection_allowed")) {
        enableWeb3()
      }
    }
  }, [isWeb3Enabled])

  useEffect(() => {
    Moralis.onAccountChanged((account) => {
      if (typeof window != "undefined") {
        if (account == null) {
          window.localStorage.removeItem("connection_allowed")
          deactivateWeb3()
        }
      }
    })
  }, [account])

  const btnClass = clsx({
    btn: true,
    "btn-success": account,
    "btn-primary": !account,
  })
  const btnText = account
    ? `Connected to: ${account.slice(0, 4)}...${account.slice(38, 42)}`
    : "Connect"

  return (
    <div>
      <button
        disabled={isWeb3EnableLoading}
        onClick={async () => {
          await enableWeb3()
          if (typeof window != "undefined") {
            window.localStorage.setItem("connection_allowed", "injectedWeb3")
          }
        }}
        className={btnClass}
      >
        {btnText}
      </button>
    </div>
  )
}
