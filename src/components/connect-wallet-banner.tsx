'use client'

import { useAccount, useConnect, useDisconnect } from 'wagmi'
import { injected } from 'wagmi/connectors'
import { Loader2Icon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

const ConnectionIndicator = ({ status }) => {
  let color = "bg-red-500"
  let animation = ""

  if (status === "connecting") {
    color = "bg-orange-700"
  } else if (status === "connected") {
    color = "bg-black"
    animation = "animate-pulse"
  }

  return (
    <div
      className={`w-3 h-3 rounded-full ${color} ${animation}`}
      aria-hidden="true"
    />
  )
}

export function ConnectWalletBannerComponent() {
  const { address, isConnected } = useAccount()
  const { connect, isPending } = useConnect()
  const { disconnect } = useDisconnect()

  const handleAction = () => {
    if (isConnected) {
      disconnect()
    } else {
      connect({ connector: injected() })
    }
  }

  const connectionStatus = isConnected ? "connected" : (isPending ? "connecting" : "disconnected")

  return (
    <Card className="w-full max-w-2xl mx-auto my-8">
      <CardHeader>
        <CardTitle>Wallet Connection</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          Connect your wallet to interact with the application.
        </p>
        <div className="flex items-center space-x-4">
          <ConnectionIndicator status={connectionStatus} />
          <Button
            onClick={handleAction}
            disabled={isPending}
            variant={isConnected ? "destructive" : "default"}
          >
            {isPending ? (
              <>
                <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : isConnected ? (
              "Disconnect"
            ) : (
              "Connect Wallet"
            )}
          </Button>
        </div>
        {isConnected && (
          <p className="text-sm text-muted-foreground">
            Connected address: {address}
          </p>
        )}
      </CardContent>
    </Card>
  )
}