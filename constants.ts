
import { Language, IssueType, Severity, IssueStatus } from './types';

export interface CityData {
  name: string;
  district: string;
  region: 'Konkan' | 'Paschim Maharashtra' | 'Khandesh' | 'Marathwada' | 'Vidarbha';
  lat: number;
  lng: number;
}

export const MAHARASHTRA_CITIES: CityData[] = [
  // Konkan
  { name: 'Mumbai', district: 'Mumbai City', region: 'Konkan', lat: 19.0760, lng: 72.8777 },
  { name: 'Navi Mumbai', district: 'Thane', region: 'Konkan', lat: 19.0330, lng: 73.0297 },
  { name: 'Thane', district: 'Thane', region: 'Konkan', lat: 19.2183, lng: 72.9781 },
  { name: 'Kalyan-Dombivli', district: 'Thane', region: 'Konkan', lat: 19.2344, lng: 73.1296 },
  { name: 'Ulhasnagar', district: 'Thane', region: 'Konkan', lat: 19.2215, lng: 73.1645 },
  { name: 'Mira-Bhayandar', district: 'Thane', region: 'Konkan', lat: 19.2952, lng: 72.8541 },
  { name: 'Bhiwandi-Nizampur', district: 'Thane', region: 'Konkan', lat: 19.2813, lng: 73.0483 },
  { name: 'Vasai-Virar', district: 'Palghar', region: 'Konkan', lat: 19.3919, lng: 72.8397 },
  { name: 'Palghar', district: 'Palghar', region: 'Konkan', lat: 19.6936, lng: 72.7655 },
  { name: 'Panvel', district: 'Raigad', region: 'Konkan', lat: 18.9894, lng: 73.1175 },
  { name: 'Alibag', district: 'Raigad', region: 'Konkan', lat: 18.6584, lng: 72.8773 },
  { name: 'Ratnagiri', district: 'Ratnagiri', region: 'Konkan', lat: 16.9902, lng: 73.3120 },
  { name: 'Chiplun', district: 'Ratnagiri', region: 'Konkan', lat: 17.5323, lng: 73.5175 },
  { name: 'Sindhudurg', district: 'Sindhudurg', region: 'Konkan', lat: 16.0360, lng: 73.5620 },
  { name: 'Malvan', district: 'Sindhudurg', region: 'Konkan', lat: 16.0617, lng: 73.4683 },

  // Paschim Maharashtra (Western Maharashtra)
  { name: 'Pune', district: 'Pune', region: 'Paschim Maharashtra', lat: 18.5204, lng: 73.8567 },
  { name: 'Pimpri-Chinchwad', district: 'Pune', region: 'Paschim Maharashtra', lat: 18.6298, lng: 73.7997 },
  { name: 'Solapur', district: 'Solapur', region: 'Paschim Maharashtra', lat: 17.6599, lng: 75.9064 },
  { name: 'Kolhapur', district: 'Kolhapur', region: 'Paschim Maharashtra', lat: 16.7050, lng: 74.2433 },
  { name: 'Ichalkaranji', district: 'Kolhapur', region: 'Paschim Maharashtra', lat: 16.7001, lng: 74.4567 },
  { name: 'Sangli-Miraj-Kupwad', district: 'Sangli', region: 'Paschim Maharashtra', lat: 16.8524, lng: 74.5815 },
  { name: 'Satara', district: 'Satara', region: 'Paschim Maharashtra', lat: 17.6805, lng: 73.9915 },
  { name: 'Karad', district: 'Satara', region: 'Paschim Maharashtra', lat: 17.2855, lng: 74.1835 },
  { name: 'Ahmednagar', district: 'Ahmednagar', region: 'Paschim Maharashtra', lat: 19.0948, lng: 74.7480 },

  // Khandesh (North Maharashtra)
  { name: 'Nashik', district: 'Nashik', region: 'Khandesh', lat: 19.9975, lng: 73.7898 },
  { name: 'Malegaon', district: 'Nashik', region: 'Khandesh', lat: 20.5517, lng: 74.5298 },
  { name: 'Dhule', district: 'Dhule', region: 'Khandesh', lat: 20.9042, lng: 74.7749 },
  { name: 'Jalgaon', district: 'Jalgaon', region: 'Khandesh', lat: 21.0077, lng: 75.5626 },
  { name: 'Bhusawal', district: 'Jalgaon', region: 'Khandesh', lat: 21.0478, lng: 75.7725 },
  { name: 'Nandurbar', district: 'Nandurbar', region: 'Khandesh', lat: 21.3739, lng: 74.2372 },

  // Marathwada
  { name: 'Aurangabad (Chhatrapati Sambhajinagar)', district: 'Aurangabad', region: 'Marathwada', lat: 19.8762, lng: 75.3433 },
  { name: 'Nanded-Waghala', district: 'Nanded', region: 'Marathwada', lat: 19.1429, lng: 77.3039 },
  { name: 'Latur', district: 'Latur', region: 'Marathwada', lat: 18.4088, lng: 76.5604 },
  { name: 'Parbhani', district: 'Parbhani', region: 'Marathwada', lat: 19.2644, lng: 76.7767 },
  { name: 'Beed', district: 'Beed', region: 'Marathwada', lat: 18.9891, lng: 75.7601 },
  { name: 'Osmanabad (Dharashiv)', district: 'Osmanabad', region: 'Marathwada', lat: 18.1852, lng: 76.0420 },
  { name: 'Jalna', district: 'Jalna', region: 'Marathwada', lat: 19.8297, lng: 75.8800 },
  { name: 'Hingoli', district: 'Hingoli', region: 'Marathwada', lat: 19.7181, lng: 77.1478 },

  // Vidarbha
  { name: 'Nagpur', district: 'Nagpur', region: 'Vidarbha', lat: 21.1458, lng: 79.0882 },
  { name: 'Amravati', district: 'Amravati', region: 'Vidarbha', lat: 20.9320, lng: 77.7523 },
  { name: 'Akola', district: 'Akola', region: 'Vidarbha', lat: 20.7002, lng: 77.0082 },
  { name: 'Chandrapur', district: 'Chandrapur', region: 'Vidarbha', lat: 19.9511, lng: 79.2961 },
  { name: 'Yavatmal', district: 'Yavatmal', region: 'Vidarbha', lat: 20.3888, lng: 78.1204 },
  { name: 'Wardha', district: 'Wardha', region: 'Vidarbha', lat: 20.7453, lng: 78.6022 },
  { name: 'Gondia', district: 'Gondia', region: 'Vidarbha', lat: 21.4624, lng: 80.1904 },
  { name: 'Bhandara', district: 'Bhandara', region: 'Vidarbha', lat: 21.1685, lng: 79.6548 },
  { name: 'Washim', district: 'Washim', region: 'Vidarbha', lat: 20.1012, lng: 77.1332 },
  { name: 'Gadchiroli', district: 'Gadchiroli', region: 'Vidarbha', lat: 20.1850, lng: 79.9922 },
  { name: 'Buldhana', district: 'Buldhana', region: 'Vidarbha', lat: 20.5284, lng: 76.1843 },
];

export const CITIES = MAHARASHTRA_CITIES.map(c => c.name).sort();
export const WARDS = ['Ward A', 'Ward B', 'Ward C', 'Ward D', 'Ward E'];

export const DEPARTMENTS: Record<IssueType, string> = {
  [IssueType.POTHOLE]: 'Road Maintenance Dept',
  [IssueType.GARBAGE]: 'Sanitation Dept',
  [IssueType.STREETLIGHT]: 'Electrical Dept',
  [IssueType.WATER_LEAKAGE]: 'Water Supply Dept',
  [IssueType.DRAINAGE]: 'Sewerage Dept'
};

export const TRANSLATIONS: Record<Language, any> = {
  [Language.ENGLISH]: {
    appName: 'FixMyCity',
    tagline: 'Click. Report. Fix.',
    login: 'Login',
    signUp: 'Sign Up',
    home: 'Home',
    report: 'Report',
    notifications: 'Notifications',
    leaderboard: 'Leaderboard',
    profile: 'Profile',
    issueTypes: {
      [IssueType.POTHOLE]: 'Pothole',
      [IssueType.GARBAGE]: 'Garbage',
      [IssueType.STREETLIGHT]: 'Broken Streetlight',
      [IssueType.WATER_LEAKAGE]: 'Water Leakage',
      [IssueType.DRAINAGE]: 'Drainage'
    },
    severity: {
      [Severity.CRITICAL]: 'Critical',
      [Severity.MEDIUM]: 'Medium',
      [Severity.LOW]: 'Low'
    },
    status: {
      [IssueStatus.REPORTED]: 'Work Reported',
      [IssueStatus.IN_PROGRESS]: 'Work In Progress',
      [IssueStatus.FIXED]: 'Work Fixed'
    }
  },
  [Language.MARATHI]: {
    appName: 'फिक्स माय सिटी',
    tagline: 'क्लिक करा. कळवा. दुरुस्त करा.',
    login: 'लॉगिन',
    signUp: 'साइन अप',
    home: 'मुख्यपृष्ठ',
    report: 'अहवाल',
    notifications: 'सूचना',
    leaderboard: 'लीडरबोर्ड',
    profile: 'प्रोफाइल',
    issueTypes: {
      [IssueType.POTHOLE]: 'खड्डा',
      [IssueType.GARBAGE]: 'कचरा',
      [IssueType.STREETLIGHT]: 'बंद पथदिवे',
      [IssueType.WATER_LEAKAGE]: 'पाणी गळती',
      [IssueType.DRAINAGE]: 'ड्रेनेज समस्या'
    },
    severity: {
      [Severity.CRITICAL]: 'गंभीर',
      [Severity.MEDIUM]: 'मध्यम',
      [Severity.LOW]: 'कमी'
    },
    status: {
      [IssueStatus.REPORTED]: 'नोंदणीकृत',
      [IssueStatus.IN_PROGRESS]: 'प्रगतीपथावर',
      [IssueStatus.FIXED]: 'दुरुस्त'
    }
  }
};
