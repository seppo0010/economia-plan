import './DependencyChart.css'
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from './store'
import { toggleSubject } from './subjectsStatus'

const subjectsRect = {
  131: [268, 201, 136, 62],
  144: [266, 358, 136, 62],
  132: [268, 551, 136, 62],
  135: [268, 657, 136, 62],
  138: [479, 775, 133, 59],
  136: [479, 657, 133, 59],
  134: [479, 552, 133, 59],
  142: [718, 774, 133, 59],
  137: [718, 658, 133, 59],
  133: [716, 551, 136, 62],
  141: [718, 316, 133, 59],
  139: [718, 211, 133, 59],
  162: [954, 258, 134, 60],
  145: [954, 434, 133, 59],
  140: [954, 552, 133, 59],
  167: [954, 657, 134, 60],
  163: [952, 831, 134, 60],
  169: [1187, 552, 134, 60],
  168: [1187, 255, 134, 60],
}
function DependencyChart() {
  const checked = useSelector((state: RootState) => state.subjectsStatus);
  const dispatch = useDispatch()
  const handleClick = (id: string) => {
    dispatch(toggleSubject(id))
  }
  return (
      <div>
          <svg width="1406" height="946" viewBox="0 0 1406 946"  xmlns="http://www.w3.org/2000/svg">
              <image href="/acercade_correlatividades.jpg" width="1406" height="946"/>
              {Object.entries(subjectsRect).map(([key, value]) => (
                <rect key={key} x={value[0]} y={value[1]} width={value[2]} height={value[3]} fill={checked.has(key) ? 'red' : 'transparent'} fillOpacity="0.7" rx="22" ry="22" onClick={() => handleClick(key.toString())} cursor="pointer" />
              ))}
          </svg>
      </div>
  )
}

export default DependencyChart
