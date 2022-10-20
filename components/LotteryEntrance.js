import { useState, useEffect } from "react"
import { useMoralis, useWeb3Contract } from "react-moralis"
import { ethers } from "ethers"
import { useNotification } from "web3uikit"
import { abi, contractAddresses } from "../constants/index"
import EnterCard from "./EnterCard"
import PlayersCard from "./PlayersCard"
// import { dotenv } from "dotenv"

const LOTTERY_STATE = ["Opened", "Closed"]

export default function LotteryEntrance() {
  /* state variables from contract function calls */
  // const [lotteryBalance, setLotteryBalance] = useState("")
  const [lotteryFee, setLotteryFee] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [lotteryState, setLotteryState] = useState(null)
  const [players, setPlayers] = useState([])
  /* state variables from events */
  const [newPlayer, setNewPlayer] = useState("")
  const [newWinnerInfo, setNewWinnerInfo] = useState({
    winner: "",
    winPrize: "",
    winDate: "",
  })
  const [newWinnerBeingPicked, setNewWinnerBeingPicked] = useState(false)

  const dispatch = useNotification()

  /* Lottery address */
  const { chainId: chainIdHex, isWeb3Enabled } = useMoralis()
  const chainId = parseInt(chainIdHex)
  const lotteryAddress =
    chainId in contractAddresses
      ? contractAddresses[chainId][contractAddresses[chainId].length - 1]
      : null

  /* Events listeners */
  const webSocket =
    chainId == 5
      ? process.env.NEXT_PUBLIC_GOERLI_WEB_SOCKET
      : chainId == 80001
      ? process.env.NEXT_PUBLIC_MUMBAI_WEB_SOCKET
      : null
  if (webSocket) {
    const webSocketProvider = new ethers.providers.WebSocketProvider(webSocket)

    const lotteryWithWebSocket = new ethers.Contract(
      lotteryAddress,
      abi,
      webSocketProvider
    )

    lotteryWithWebSocket.on("LotteryEntered", async (player, event) => {
      let info = {
        player: player,
        data: event,
      }
      // add notification
      setNewPlayer(player)
      console.log(JSON.stringify(info, null, 2))
    })

    lotteryWithWebSocket.on("RandomWinnerRequested", (requestId, event) => {
      let info = {
        requestId: requestId,
        data: event,
      }
      // setNewWinnerBeingPicked(true)
      console.log("RandomWinnerRequested")

      console.log(JSON.stringify(info, null, 2))
    })

    lotteryWithWebSocket.on(
      "WinnerPicked",
      (s_newWinner, s_newPrize, winDate, event) => {
        let info = {
          winner: s_newWinner,
          winPrize: ethers.utils.formatEther(s_newPrize),
          winDate: new Date(winDate),
          data: event,
        }
        setNewWinnerInfo({
          winner: winner,
          winPrize: winPrize,
          winDate: winDate,
        })
        console.log(JSON.stringify(info, null, 4))
      }
    )
  }

  useEffect(() => {
    if (isWeb3Enabled) {
      const init = async () => {
        await updateUI()
      }
      init()
    }
  }, [isWeb3Enabled])

  async function updateUI() {
    const lotteryFee = await getFee()
    const endDate = await getEndDate()
    const lotteryState = await getLotteryState()
    const players = await getPlayers()
    setLotteryFee(lotteryFee)
    setEndDate(endDate)
    setLotteryState(lotteryState)
    setPlayers(players)
  }

  /* Lottery functions w/ Moralis helpers */
  const { runContractFunction: enterLottery } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress,
    functionName: "enterLottery",
    params: {},
    msgValue: lotteryFee,
  })

  const { runContractFunction: getFee } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress,
    functionName: "getFee",
    params: {},
  })

  const { runContractFunction: getEndDate } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress,
    functionName: "getEndDate",
    params: {},
  })

  const { runContractFunction: getPlayers } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress,
    functionName: "getPlayers",
    params: {},
  })

  const { runContractFunction: getLotteryState } = useWeb3Contract({
    abi: abi,
    contractAddress: lotteryAddress,
    functionName: "getLotteryState",
    params: {},
  })

  if (lotteryState) {
    console.log("lottery state", LOTTERY_STATE[lotteryState.toNumber()])
  }

  /* */
  const handleSucess = async (tx) => {
    tx.wait(1)
    handleNewNotification("Tx Notification", "Transaction complete")
    updateUI()
  }

  const handleNewNotification = (title, message) => {
    dispatch({
      type: "Info",
      title: title,
      message: message,
      position: "topR",
      icon: "bell",
    })
  }

  if (endDate) {
    console.log("endDate nbr", endDate.toNumber())
    console.log("endDate date", new Date(endDate.toNumber() * 1000))
  }

  const isReady = lotteryAddress != null && lotteryFee != null && players

  return (
    <>
      {isReady ? (
        <>
          <EnterCard
            lotteryState={lotteryState}
            lotteryFee={lotteryFee}
            enterLottery={enterLottery}
            handleSucess={handleSucess}
            newWinnerInfo={newWinnerInfo}
          />
          <PlayersCard players={players} newPlayer={newPlayer} />
        </>
      ) : (
        <p className='card-text'>Lottery available on Goerli & Mumbai</p>
      )}
    </>
  )
}
