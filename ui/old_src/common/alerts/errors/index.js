export default function flashError (e) {
  window.alert(`Error: ${e.message || e.statusText}`)
}

export function flashCustomErrorMessage (msg) {
  window.alert(msg)
}
