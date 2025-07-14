import {
  FiPlus,
  FiEdit3,
  FiTrash2,
  FiSave,
  FiX,
  FiMoreHorizontal,
  FiUser,
  FiCalendar,
  FiTag,
  FiMove,
  FiCheck,
  FiAlertCircle,
  FiUsers,
  FiClock,
  FiEye,
  FiColumns,
  FiGrid,
  FiSettings,
  FiChevronDown,
  FiChevronRight,
  FiMessageSquare,
} from "react-icons/fi";

import { MdDragIndicator, MdDashboard } from "react-icons/md";

import { BsKanban, BsCardText, BsPin } from "react-icons/bs";

export const actionIcons = {
  add: FiPlus,
  edit: FiEdit3,
  delete: FiTrash2,
  save: FiSave,
  close: FiX,
  menu: FiMoreHorizontal,
  move: FiMove,
  confirm: FiCheck,
  warning: FiAlertCircle,
  view: FiEye,
  settings: FiSettings,
  expand: FiChevronDown,
  collapse: FiChevronRight,
} as const;

export const uiIcons = {
  user: FiUser,
  users: FiUsers,
  calendar: FiCalendar,
  tag: FiTag,
  clock: FiClock,
  drag: MdDragIndicator,
  column: FiColumns,
  board: MdDashboard,
  kanban: BsKanban,
  card: BsCardText,
  pin: BsPin,
  grid: FiGrid,
  comment: FiMessageSquare,
  message: FiMessageSquare,
} as const;
