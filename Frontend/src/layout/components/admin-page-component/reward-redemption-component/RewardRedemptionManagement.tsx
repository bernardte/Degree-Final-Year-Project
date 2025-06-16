// src/components/RewardRedemptionManagement.js
import { useState, useEffect,  JSX } from "react";
import {
  Gift,
  Bed,
  Utensils,
  ShoppingBag,
  Sparkles,
  Plane,
  Wine,
  Clock,
  Heart,
  Star,
  Percent,
} from "lucide-react";
import RewardHeader from "./RewardHeader";
import StatsCard from "./StatsCard";
import FilterSearch from "./FilterSearch";
import RewardTable from "./RewardTable";
import { Reward } from "@/types/interface.type";
import ShowRewardModal from "./ShowRewardModal";

const RewardRedemptionManagement = () => {
  // State for rewards data
  const [rewards, setRewards] = useState(() => {
    const savedRewards = localStorage.getItem("rewards");
    return savedRewards
      ? JSON.parse(savedRewards)
      : [
          {
            id: 1,
            name: "Free Night Stay",
            description: "Complimentary one-night stay in a standard room",
            points: 10000,
            category: "Accommodation",
            status: "Active",
            icon: "Bed",
          },
          {
            id: 2,
            name: "Breakfast Package",
            description: "Daily breakfast for two during stay",
            points: 1500,
            category: "Dining",
            status: "Active",
            icon: "Utensils",
          },
          {
            id: 3,
            name: "Room Upgrade",
            description: "Complimentary room upgrade upon availability",
            points: 5000,
            category: "Accommodation",
            status: "Active",
            icon: "Sparkles",
          },
          {
            id: 4,
            name: "Spa Treatment",
            description: "60-minute spa treatment for one",
            points: 3000,
            category: "Experience",
            status: "Inactive",
            icon: "Heart",
          },
        ];
  });

  // State for form inputs
  const [formData, setFormData] = useState({
    _id: "",
    name: "",
    description: "",
    points: 0,
    category: "Accommodation",
    status: "Active",
    icon: "Bed",
  });

  // State for editing
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");

  // Save rewards to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("rewards", JSON.stringify(rewards));
  }, [rewards]);

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "points" ? Number(value) : value,
    }));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isEditing) {
      // Update existing reward
      setRewards(
        rewards.map((reward: Reward) =>
          reward._id === formData._id ? formData : reward,
        ),
      );
    } else {
      // Add new reward
      const newReward = {
        ...formData,
        id: Date.now(), // Simple unique ID
      };
      setRewards([...rewards, newReward]);
    }

    // Reset form and close modal
    resetForm();
    setShowModal(false);
  };

  // Set form data for editing
  const handleEdit = (reward: Reward) => {
    setFormData(reward);
    setIsEditing(true);
    setShowModal(true);
  };

  // Delete a reward
  const handleDelete = (rewardId: string) => {
    if (window.confirm("Are you sure you want to delete this reward?")) {
      setRewards(rewards.filter((reward: Reward) => reward._id !== rewardId));
    }
  };

  // Reset form data
  const resetForm = () => {
    setFormData({
      _id: "",
      name: "",
      description: "",
      points: 0,
      category: "Accommodation",
      status: "Active",
      icon: "Bed",
    });
    setIsEditing(false);
  };

  // Get icon component based on string
  const iconKeys = [
    "Gift",
    "Bed",
    "Utensils",
    "ShoppingBag",
    "Sparkles",
    "Plane",
    "Wine",
    "Clock",
    "Heart",
    "Star",
    "Percent",
  ] as const;
  type IconName = (typeof iconKeys)[number];

  const getIconComponent = (iconName: IconName | string) => {
    const icons: Record<IconName, JSX.Element> = {
      Gift: <Gift className="text-amber-500" size={24} />,
      Bed: <Bed className="text-blue-500" size={24} />,
      Utensils: <Utensils className="text-orange-500" size={24} />,
      ShoppingBag: <ShoppingBag className="text-purple-500" size={24} />,
      Sparkles: <Sparkles className="text-yellow-500" size={24} />,
      Plane: <Plane className="text-indigo-500" size={24} />,
      Wine: <Wine className="text-red-500" size={24} />,
      Clock: <Clock className="text-cyan-500" size={24} />,
      Heart: <Heart className="text-pink-500" size={24} />,
      Star: <Star className="text-amber-400" size={24} />,
      Percent: <Percent className="text-green-500" size={24} />,
    };

    return (
      icons[iconName as IconName] || (
        <Gift className="text-amber-500" size={24} />
      )
    );
  };

  // Filter rewards based on search and filters
  const filteredRewards = rewards.filter((reward: Reward) => {
    const matchesSearch =
      reward.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      reward.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      filterCategory === "All" || reward.category === filterCategory;
    const matchesStatus =
      filterStatus === "All" || reward.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <RewardHeader setShowModal={setShowModal} />

      {/* Stats Cards */}
      <StatsCard rewards={rewards} />

      {/* Filters and Search */}
      <FilterSearch
        setSearchTerm={setSearchTerm}
        searchTerm={searchTerm}
        filterCategory={filterCategory}
        setFilterCategory={setFilterCategory}
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
      />

      {/* Rewards Table */}
      <RewardTable
        filteredRewards={filteredRewards}
        getIconComponent={getIconComponent}
        handleEdit={handleEdit}
        handleDelete={handleDelete}
      />

      {/* Add/Edit Reward Modal */}
      {showModal && (
        <ShowRewardModal
          isEditing={isEditing}
          setShowModal={setShowModal}
          resetForm={resetForm}
          handleSubmit={handleSubmit}
          handleChange={handleChange}
          getIconComponent={getIconComponent}
          formData={formData}
          setFormData={setFormData}
        />
      )}
    </div>
  );
};

export default RewardRedemptionManagement;
