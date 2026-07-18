import { useState } from 'react'
import HeroBanner from '../components/HeroBanner.jsx'
import StartingFive from '../components/StartingFive.jsx'
import BiographyModal from '../components/BiographyModal.jsx'
import BenchSection from '../components/BenchSection.jsx'
import HonorWall from '../components/HonorWall.jsx'
import Footer from '../components/Footer.jsx'

// 主页叙事流：入营(Hero) → 点将(五虎) → 阅兵(偏将) → 战报(荣誉墙)
export default function Home() {
  const [selected, setSelected] = useState(null)

  return (
    <main>
      <HeroBanner />
      <StartingFive onSelect={setSelected} />
      <BenchSection />
      <HonorWall />
      <Footer />
      <BiographyModal player={selected} onClose={() => setSelected(null)} />
    </main>
  )
}
