import { useState, useEffect, useContext } from "react"
import AppContext from "../../../context/App/AppContext"
import { useRosterGroups, useSelectDate, setGroups, handleDateChange } from "."
import styles from './RosterContainer.module.css'

// Types
import { RosterContainerProps, RosterContainerState, RosterItem } from "./types"

// Components
import RosterTable from "../RosterTable/RosterTable"
import HideBtn from "../../buttons/HideBtn/HideBtn"
import CalendarIcon from "../../icons/CalendarIcon/CalendarIcon"
import LoadingIcon from "../../icons/LoadingIcon/LoadingIcon"
import RosterLegend from "../RosterLegend/RosterLegend"

function RosterContainer({ data }: RosterContainerProps) {
  const { date, dispatch } = useContext(AppContext)

  const [state, setState] = useState<RosterContainerState>({ hidden: false, showDatePicker: false, date: date ? date : '' })

  const selectDate = useSelectDate(state.date, dispatch)

  const groups = useRosterGroups(data)

  const stationGroups = setGroups(groups)

  useEffect(() => { // Set selected date to ctx
    selectDate()
  }, [state.date])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <div>{state.date ? new Date(new Date(state.date).setDate(new Date(state.date).getDate() + 1)).toDateString() : new Date().toDateString()}</div>
        <button 
          type="button"
          className={styles.calendarBtn}
          onClick={() => setState(prevState => ({ ...prevState, showDatePicker: !prevState.showDatePicker }))}>
            <CalendarIcon width={28} height={28} />
        </button>
        {state.showDatePicker && (
          <input 
            type="date"
            className="input text-warning-content bg-warning"
            onChange={(e) => handleDateChange(e, setState)} />
        )}
      </div>
      <div>
        <HideBtn
          setState={setState}
          label={!state.hidden ? 'Hide Rosters' : 'Show Rosters'} />
      </div>
      <div className={state.hidden ? 'hidden' : styles.tables}>
        {stationGroups.length ? stationGroups.map(obj => {
          return (
            <div key={`station-${ obj.station }`} className="flex flex-col">
              <div className={styles.stationHeader}>Station {obj.station}</div>
              <div className={styles.stationGroup}>
                {obj.units.map(unit => {
                  return (
                    <RosterTable
                      key={unit.unit}
                      data={unit.roster as RosterItem[]}
                      label={unit.unit} />
                  )
                })} 
                <div className={styles.rosterLegend}>
                  <RosterLegend />
                </div>
              </div>
            </div>
          )
        }) : (
            <LoadingIcon width={200} height={200} />
        )}
      </div>
    </div>
  )
}

export default RosterContainer
