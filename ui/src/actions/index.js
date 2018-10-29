import { setEvents, fetchEventsByPeriod, eventShowMore } from './event'
import { setSortByKey } from './history'
import {
  setFilterBy,
  setEventsRetrieved,
  setLookupTerm,
  setLookupParam
} from './dashboard'
import { closeSidebar, openSidebar } from './sidebar'
import { navigateTo, updatePath, replacePath } from './navigation'
import {
  setCategories,
  fetchCategories,
  setCategoriesRetrieved,
  fetchCategoryEvents,
  setCategoryEventsRetrieved
} from './category'
import {
  submitUserCredentials,
  submitForgotEmail,
  setAlertMessage,
  setAuthTokens,
  createUser,
  setUserInfo,
  logout,
  submitResetPassword
} from './auth'
import {
  unsetSpinnerOverlay,
  setSpinnerOverlay
} from './fileUpload'
import {
  setTodosRetrieved,
  createTodo,
  updateTodo,
  removeTodo,
  deleteTodo,
  setTodos,
  fetchTodos,
  shareTodo,
  fetchTodoSharedWith,
  setTodoSharedWith,
  fetchTodoShareableWith,
  setTodoShareableWith,
  updateTodoPreferences
} from './todo'
import {
  setTags,
  setTagsRetrieved,
  fetchTags,
  createTag,
  tagEntity,
  removeTag,
  setSelectedTags
} from './tag'
import {
  setNotes,
  setNotesRetrieved,
  fetchNotes,
  fetchNote,
  createNote,
  updateNote,
  deleteNote,
  removeNote,
  shareNote,
  setNoteSharedWith,
  setNoteShareableWith,
  fetchNoteSharedWith,
  fetchNoteShareableWith,
  updateNotePreferences
} from './note'
import {
  setContacts,
  setContactsRetrieved,
  fetchContacts,
  createContact
} from './contact'
import {
  setPreferences,
  fetchPreference,
  updatePreference
} from './preferences'

export {
  setEvents,
  fetchEventsByPeriod,
  eventShowMore,
  navigateTo,
  setEventsRetrieved,
  setSortByKey,
  setFilterBy,
  setLookupTerm,
  closeSidebar,
  openSidebar,
  updatePath,
  setCategoriesRetrieved,
  setCategories,
  fetchCategories,
  fetchCategoryEvents,
  setCategoryEventsRetrieved,
  createUser,
  submitUserCredentials,
  setAuthTokens,
  setSpinnerOverlay,
  setUserInfo,
  unsetSpinnerOverlay,
  setLookupParam,
  createTodo,
  updateTodo,
  deleteTodo,
  removeTodo,
  setTodos,
  setTodosRetrieved,
  fetchTodos,
  setTags,
  setTagsRetrieved,
  fetchTags,
  createTag,
  tagEntity,
  removeTag,
  setNotes,
  setNotesRetrieved,
  fetchNotes,
  fetchNote,
  createNote,
  updateNote,
  deleteNote,
  removeNote,
  logout,
  submitForgotEmail,
  setAlertMessage,
  submitResetPassword,
  shareNote,
  shareTodo,
  setContacts,
  setContactsRetrieved,
  fetchContacts,
  createContact,
  fetchTodoSharedWith,
  setTodoSharedWith,
  fetchTodoShareableWith,
  setTodoShareableWith,
  setNoteSharedWith,
  setNoteShareableWith,
  fetchNoteSharedWith,
  fetchNoteShareableWith,
  setPreferences,
  updatePreference,
  fetchPreference,
  updateTodoPreferences,
  updateNotePreferences,
  replacePath,
  setSelectedTags
}
