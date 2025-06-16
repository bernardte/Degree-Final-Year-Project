// src/components/RewardRedemptionManagement.js
import { useState, useEffect, JSX } from "react";
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
import useRewardStore from "@/stores/useRewardStore";
import useApiRequest from "@/hooks/useApiRequest";

const RewardManagement = () => {
  // State for form inputs
  const [formData, setFormData] = useState<Reward>({
    _id: "",
    name: "",
    description: "",
    points: 0,
    category: "Accommodation",
    status: "active",
    icon: "Bed",
  });
  // State for editing
  const [isEditing, setIsEditing] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const {
    fetchAllRewardList,
    isLoading,
    error,
    addRewards,
    rewards: storeRewards,
    deleteReward,
    updateNewReward
  } = useRewardStore((state) => state);
  const { request, isLoading: loading } = useApiRequest();

  useEffect(() => {
    fetchAllRewardList();
  }, [fetchAllRewardList]);

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "points" ? Number(value) : value,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, rewardId: string) => {
    e.preventDefault();

    if (isEditing) {
      const updateReward = await request(
        "patch",
        `/reward/rewards/${rewardId}`,
        formData,
        {},
        "update Successful",
        "success"
      )
      if(updateReward){
        setIsEditing(false);
        setShowModal(false);
        updateNewReward(updateReward);
      }
    } else {
      const newReward = await request(
        "post",
        "/reward/rewards",
        formData,
        {},
        "Added Successful",
        "success",
      );
      if (newReward) {
        addRewards(newReward);
        console.log(newReward);
        setFilterCategory("All");
        setFilterStatus("All");
        setSearchTerm("");
        setShowModal(false);
      }
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
    if (rewardId) {
      request("delete", `/reward/rewards/${rewardId}`, {}, {}, "Delete Reward Successful", "success");
      deleteReward(rewardId);
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
      status: "active",
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
  const filteredRewards = storeRewards.filter((reward: Reward) => {
    const name = reward?.name?.toLowerCase() || "";
    const description = reward?.description?.toLowerCase() || "";
    const search = searchTerm?.toLowerCase() || "";

    const matchesSearch = name.includes(search) || description.includes(search);

    const matchesCategory =
      filterCategory === "All" || reward?.category === filterCategory;
    const matchesStatus =
      filterStatus === "All" || reward?.status === filterStatus;

    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-t-2 border-b-2 border-blue-500"></div>
        <span className="ml-2 text-gray-600">Loading...</span>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      {/* Header */}
      <RewardHeader setShowModal={setShowModal} />

      {/* Stats Cards */}
      <StatsCard rewards={storeRewards} />

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
        error={error}
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
          loading={loading}
        />
      )}
    </div>
  );
};

export default RewardManagement;
