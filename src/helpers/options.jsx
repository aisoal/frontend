import {
  HamburgerIcon,
  EditIcon,
  CopyIcon,
  MinusIcon,
  Icon,
} from "@chakra-ui/icons";
import { FaLowVision, FaCrosshairs, FaRocket } from "react-icons/fa";

const difficultyOptions = [
  {
    value: "lots",
    label: "Dasar (LOTS)",
    icon: FaLowVision,
    description: "Mengingat & Memahami Fakta",
  },
  {
    value: "mots",
    label: "Menengah (MOTS)",
    icon: FaCrosshairs,
    description: "Menerapkan & Menganalisis Informasi",
  },
  {
    value: "hots",
    label: "Tingkat Lanjut (HOTS)",
    icon: FaRocket,
    description: "Mengevaluasi & Mencipta Solusi",
  },
];

const typeOptions = [
  {
    value: "multiple-choice",
    label: "Pilihan Ganda",
    icon: HamburgerIcon,
  },
  { value: "essay", label: "Esai", icon: EditIcon },
  { value: "true-false", label: "Benar/Salah", icon: CopyIcon },
  { value: "fill-in-the-blank", label: "Isian", icon: MinusIcon },
];

const IndonesiaFlagIcon = (props) => (
  <Icon viewBox="0 0 6 4" {...props}>
    <path fill="#e70011" d="M0 0h6v2H0z" />
    <path fill="#fff" d="M0 2h6v2H0z" />
  </Icon>
);

const UKFlagIcon = (props) => (
  <Icon viewBox="0 0 60 30" {...props}>
    <clipPath id="a">
      <path d="M0 0h60v30H0z" />
    </clipPath>
    <path d="M0 0v30h60V0z" fill="#012169" />
    <path
      d="M0 0l60 30m0-30L0 30"
      stroke="#fff"
      strokeWidth="6"
      clipPath="url(#a)"
    />
    <path
      d="M0 0l60 30m0-30L0 30"
      clipPath="url(#a)"
      stroke="#C8102E"
      strokeWidth="4"
    />
    <path d="M30 0v30M0 15h60" stroke="#fff" strokeWidth="10" />
    <path d="M30 0v30M0 15h60" stroke="#C8102E" strokeWidth="6" />
  </Icon>
);

const languageOptions = [
  { value: "Indonesia", label: "Indonesia", icon: IndonesiaFlagIcon },
  { value: "English", label: "English", icon: UKFlagIcon },
];

export { difficultyOptions, typeOptions, languageOptions };
