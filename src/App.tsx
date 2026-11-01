import { useState } from "react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

// 한 번에 만들 게임 수 (이 숫자만 바꾸면 게임 수가 달라진다)
const GAME_COUNT = 5

// 줄 앞에 붙일 게임 이름
const LABELS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"]

// 번호 하나가 나타나는 간격(초)
const STEP = 0.06

// 한 게임: 본번호 6개 + 보너스 1개
type Game = { main: number[]; bonus: number }

// 동행복권 공 색상: 1~10 노랑, 11~20 파랑, 21~30 빨강, 31~40 회색, 41~45 초록
function ballColor(n: number) {
  if (n <= 10) return "#fbc400"
  if (n <= 20) return "#69c8f2"
  if (n <= 30) return "#ff7272"
  if (n <= 40) return "#aaaaaa"
  return "#b0d840"
}

// 한 게임 분량의 번호를 뽑는다
function pickGame(): Game {
  // 1부터 45까지 들어 있는 배열을 만든다
  const pool = Array.from({ length: 45 }, (_, i) => i + 1)

  // 피셔-예이츠 셔플: 뒤에서부터 무작위 위치와 자리를 바꿔 고르게 섞는다
  for (let i = pool.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[pool[i], pool[j]] = [pool[j], pool[i]]
  }

  // 앞 6개는 본번호(작은 수부터 정렬), 7번째는 보너스 번호
  return { main: pool.slice(0, 6).sort((a, b) => a - b), bonus: pool[6] }
}

// 번호 공 하나. delay초 뒤에 커지면서 나타난다
function Ball({ n, delay }: { n: number; delay: number }) {
  return (
    <div
      className="flex size-10 items-center justify-center rounded-full text-sm font-bold text-white shadow-[inset_-3px_-3px_6px_rgba(0,0,0,0.2)] animate-in zoom-in fade-in fill-mode-both duration-300 sm:size-11 sm:text-base"
      style={{ background: ballColor(n), animationDelay: `${delay}s` }}
    >
      {n}
    </div>
  )
}

export default function App() {
  // 화면에 보여줄 게임 목록
  const [games, setGames] = useState<Game[]>([])

  // 버튼을 누를 때마다 바뀌는 값. 공 애니메이션을 처음부터 다시 재생하는 데 쓴다
  const [round, setRound] = useState(0)

  // 버튼을 누르면 GAME_COUNT개의 게임을 새로 만든다
  function handleClick() {
    setGames(Array.from({ length: GAME_COUNT }, pickGame))
    setRound((r) => r + 1)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-xl">
        <CardHeader>
          <CardTitle className="text-2xl">안녕</CardTitle>
          <CardDescription>
            버튼을 누르면 로또 번호 {GAME_COUNT}게임(A~{LABELS[GAME_COUNT - 1]})을 한 번에 추천해 드려요.
          </CardDescription>
        </CardHeader>

        <CardContent>
          {games.length === 0 ? (
            // 아직 버튼을 누르기 전
            <p className="py-10 text-center text-sm text-muted-foreground">
              아래 버튼을 눌러 번호를 뽑아 보세요. (자동 배포 테스트)
            </p>
          ) : (
            // key에 round를 넣어 버튼을 누를 때마다 애니메이션이 다시 재생되게 한다
            <div key={round} className="flex flex-col gap-3">
              {games.map((game, g) => (
                <div key={g}>
                  {g > 0 && <Separator className="mb-3" />}
                  <div className="flex flex-wrap items-center gap-2">
                    {/* 게임 이름 A, B, C... */}
                    <Badge variant="secondary" className="w-7 justify-center">
                      {LABELS[g]}
                    </Badge>

                    {/* 본번호 6개 */}
                    {game.main.map((n, i) => (
                      <Ball key={n} n={n} delay={(g * 7 + i) * STEP} />
                    ))}

                    {/* 본번호와 보너스 사이의 + 기호 */}
                    <span className="px-1 text-xl text-muted-foreground">+</span>

                    {/* 보너스 번호 */}
                    <Ball n={game.bonus} delay={(g * 7 + 6) * STEP} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>

        <CardFooter className="justify-center">
          <Button size="lg" className="px-10" onClick={handleClick}>
            눌러줘
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}
