import { useState, useEffect } from 'react'
import { ChevronDown } from 'lucide-react'
import './Dropdown.css'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

interface DropdownProps {
  options?: string[]
  selected?: string[]
  onSelect?: (values: string[]) => void
  label?: string
  formatLabel?: (value: string) => string
  multiSelect?: boolean
  localStorageKey?: string
  selectAllOnRefresh?: boolean
  singleSelect?: boolean
  forceOpen?: boolean
  open?: boolean
  setOpen?: (open: boolean) => void
  type?: 'default' | 'date'
  value?: Date | null
  onDateChange?: (date: Date | null) => void
}

export function Dropdown({
  options = [],
  selected = [],
  onSelect,
  label = 'SELECTED',
  formatLabel = (value) => value.toUpperCase(),
  multiSelect = true,
  localStorageKey,
  selectAllOnRefresh = true,
  singleSelect = false,
  forceOpen = false,
  open,
  setOpen,
  type = 'default',
  value,
  onDateChange
}: DropdownProps) {
  const [internalSelected, setInternalSelected] = useState<string[]>([])

  useEffect(() => {
    if (type === 'date') return
    setInternalSelected(selected.length ? selected : internalSelected)
  }, [selected, type])

  useEffect(() => {
    if (type === 'date') return
    if (localStorageKey && selected.length === 0) {
      const stored = localStorage.getItem(localStorageKey)
      if (stored) {
        try {
          const parsed = JSON.parse(stored)
          if (Array.isArray(parsed)) setInternalSelected(parsed.filter(id => options.includes(id)))
          else if (typeof parsed === 'string') setInternalSelected(options.includes(parsed) ? [parsed] : [options[0]])
          else setInternalSelected(selectAllOnRefresh ? options : [options[0]])
        } catch {
          setInternalSelected(selectAllOnRefresh ? options : [options[0]])
        }
      } else {
        setInternalSelected(selectAllOnRefresh ? options : [options[0]])
      }
    } else if (selected.length === 0 && options.length) {
      setInternalSelected(selectAllOnRefresh ? options : [options[0]])
    }
  }, [options, localStorageKey, selectAllOnRefresh, type, selected.length])

  const handleToggle = () => {
    if (forceOpen) return
    setOpen && setOpen(!open)
  }

  const toggleSelect = (val: string) => {
    const currentSelected = selected.length ? selected : internalSelected
    let updated: string[]
    if (currentSelected.includes(val)) {
      if (!multiSelect || singleSelect) return
      if (currentSelected.length === 1) return
      updated = currentSelected.filter(s => s !== val)
    } else {
      updated = multiSelect ? [...currentSelected, val] : [val]
    }

    if (singleSelect) updated = [val]

    setInternalSelected(updated)
    onSelect?.(updated)
    if (localStorageKey) localStorage.setItem(localStorageKey, JSON.stringify(singleSelect ? updated[0] : updated))
    if (singleSelect && !forceOpen && setOpen) setOpen(false)
  }

  const isOpen = forceOpen || open
  const displayedSelected = selected.length ? selected : internalSelected

  return (
    <div className="dropdown-container">
      <div className="dropdown-selected" onClick={handleToggle}>
        <span>{label}</span>
        {!forceOpen && <ChevronDown size={18} className={`dropdown-chevron ${isOpen ? 'open' : ''}`} />}
      </div>

      {isOpen && (
        <div className="dropdown-options">
          {type === 'date' ? (
            <DatePicker
              inline
              selected={value}
              onChange={onDateChange}
              maxDate={new Date()}
              minDate={new Date(new Date().setDate(new Date().getDate() - 6))}
            />
          ) : (
            <ul>
              {options.map(opt => (
                <li key={opt} onClick={() => toggleSelect(opt)}>
                  <span className={`dot ${displayedSelected.includes(opt) ? 'active' : ''}`} />
                  <span className="sensor-label">{formatLabel(opt)}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  )
}