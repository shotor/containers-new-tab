import css from './search.module.css'
import { Input } from '@/components/input/input'

export type SearchProps = {
  id: string
  label: string
  value: string
  placeholder?: string
  onChange: (value: string) => void
}

/**
 * Accessible search field with a visually hidden label.
 * @param props - Field id, accessible label, value, and change callback.
 * @returns The rendered search input.
 */
export const Search: React.FC<SearchProps> = ({
  id,
  label,
  value,
  placeholder = 'Search…',
  onChange,
}) => (
  <div class={css.root}>
    <label class="visually-hidden" for={id}>
      {label}
    </label>
    <Input
      id={id}
      type="search"
      placeholder={placeholder}
      value={value}
      autocomplete="off"
      onInput={(e) => onChange(e.currentTarget.value)}
    />
  </div>
)
