import {
  Briefcase,
  Users,
  Zap,
  Eye,
  SmileIcon as Tooth,
  Heart,
  Umbrella,
  Clock,
  Calendar,
  Building,
  GraduationCap,
  Dumbbell,
  Brain,
  Home,
  Bitcoin,
  UserCircle,
  PieChart,
  Coins,
  MonitorOff,
  Shield,
  UserPlus,
  Gift,
  Leaf,
  Dog,
} from "lucide-react";

interface Benefit {
  id: string;
  label: string;
  icon: React.ReactNode;
}

export const benefits: Benefit[] = [
  { id: "401k", label: "401(k)", icon: <Briefcase className="w-3 h-3" /> },
  { id: "medical", label: "Medical insurance", icon: <Heart className="w-3 h-3" /> },
  { id: "vacation", label: "Vacation", icon: <Leaf className="w-3 h-3" /> },
  { id: "benefits", label: "Other benefits", icon: <Gift className="w-3 h-3" /> },
  { id: "remote", label: "Remote work", icon: <Umbrella className="w-3 h-3" /> },
  { id: "gym", label: "Free gym membership", icon: <Dumbbell className="w-3 h-3" /> },
  { id: "profit_sharing", label: "Profit sharing", icon: <PieChart className="w-3 h-3" /> },
  { id: "no_whiteboard", label: "No whiteboard interview", icon: <MonitorOff className="w-3 h-3" /> },
  { id: "flexible_hours", label: "Flexible hours", icon: <Clock className="w-3 h-3" /> },
  { id: "flexible_schedule", label: "Flexible schedule", icon: <Calendar className="w-3 h-3" /> },
  { id: "flexible_location", label: "Flexible location", icon: <Building className="w-3 h-3" /> },
  { id: "education", label: "Education", icon: <GraduationCap className="w-3 h-3" /> },
  { id: "wellness", label: "Wellness", icon: <Heart className="w-3 h-3" /> },
  { id: "mental_health", label: "Mental health", icon: <Brain className="w-3 h-3" /> },
  { id: "pet_friendly", label: "Pet friendly", icon: <Dog className="w-3 h-3" /> },
  { id: "work_life_balance", label: "Work-life balance", icon: <Clock className="w-3 h-3" /> },
  { id: "vision", label: "Vision insurance", icon: <Eye className="w-3 h-3" /> },
]