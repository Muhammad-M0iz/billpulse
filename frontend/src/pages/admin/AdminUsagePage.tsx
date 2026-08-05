import React, { useState } from "react";
import { Navbar } from "../../components/common/Navbar";
import { useUsers } from "../../hooks/useUsers";
import { useSubscriptionsByUser } from "../../hooks/useSubscriptions";
import { useUserUsage } from "../../hooks/useUsage";
import { RecordUsageModal } from "../../components/admin/RecordUsageModal";
import { LoadingSpinner } from "../../components/common/LoadingSpinner";
import { getAvatarUrl } from "../../utils/avatar";
import type { UserResponse, SubscriptionResponse, FeatureResponse, UsageResponse } from "../../client";

export const AdminUsagePage: React.FC = () => {
  const { users, isLoading: isLoadingUsers } = useUsers();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);

  const { subscriptions: userSubscriptions, isLoading: isLoadingSubs } =
    useSubscriptionsByUser(selectedUser?.id || null);

  const { userUsageRecords } = useUserUsage(selectedUser?.id || null);

  const [activeModalState, setActiveModalState] = useState<{
    isOpen: boolean;
    subscriptionId: number | null;
    feature: FeatureResponse | null;
    planName: string;
  }>({
    isOpen: false,
    subscriptionId: null,
    feature: null,
    planName: "",
  });

  const filteredUsers = users.filter(
    (u) =>
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const openLogModal = (
    subscriptionId: number,
    feature: FeatureResponse,
    planName: string
  ) => {
    setActiveModalState({
      isOpen: true,
      subscriptionId,
      feature,
      planName,
    });
  };

  // Helper to calculate total logged units for a specific subscription and feature
  const getLoggedUnits = (subscriptionId: number, featureId: number) => {
    return userUsageRecords
      .filter((u: UsageResponse) => u.subscription_id === subscriptionId && u.feature_id === featureId)
      .reduce((sum: number, u: UsageResponse) => sum + (u.units_used || 0), 0);
  };

  return (
    <div className="min-h-screen stitch-bg-grid text-[#dfe2ef] flex flex-col justify-between selection:bg-white selection:text-black">
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-12 w-full space-y-10 flex-1">
        {/* Header */}
        <header className="border-b border-[#1e293b] pb-6 space-y-1">
          <h1 className="text-3xl md:text-4xl text-white font-light tracking-tight flex items-center gap-3">
            <span className="material-symbols-outlined text-white text-3xl">monitoring</span>
            Admin Usage Logging Hub
          </h1>
          <p className="text-sm text-slate-400 font-light max-w-3xl">
            Search users, select their active plan subscriptions, view current usage in context, and log feature usage directly against plan features.
          </p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: User Selector Sidebar */}
          <div className="space-y-4">
            <h2 className="text-lg font-light text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400 text-xl">person</span>
              Select User
            </h2>

            {/* Search Input */}
            <div className="group relative border-b border-[#1e293b] pb-2 transition-all group-focus-within:border-white">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-slate-400 text-lg">search</span>
                <input
                  type="text"
                  placeholder="Search user by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none focus:ring-0 focus:outline-none text-white text-xs font-mono-data placeholder:text-slate-600"
                />
              </div>
            </div>

            {/* User List */}
            {isLoadingUsers ? (
              <LoadingSpinner label="Loading users list..." />
            ) : filteredUsers.length === 0 ? (
              <p className="text-xs text-slate-500 font-mono-data italic p-4 text-center">No users found.</p>
            ) : (
              <div className="space-y-2.5 max-h-[600px] overflow-y-auto pr-1">
                {filteredUsers.map((u) => {
                  const isSelected = selectedUser?.id === u.id;
                  const avatarUrl = getAvatarUrl(u.profile_img);

                  return (
                    <div
                      key={u.id}
                      onClick={() => setSelectedUser(u)}
                      className={`p-4 border flex items-center justify-between cursor-pointer transition-all ${
                        isSelected
                          ? "bg-[#181b25] border-white text-white shadow-md"
                          : "bg-[#181b25]/60 border-[#1e293b] text-slate-300 hover:border-slate-500"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        {avatarUrl ? (
                          <img
                            src={avatarUrl}
                            alt={u.name}
                            className="w-9 h-9 rounded-none object-cover border border-[#1e293b]"
                          />
                        ) : (
                          <div className="w-9 h-9 bg-[#0b0f19] border border-[#1e293b] flex items-center justify-center text-white font-mono-data font-bold text-xs">
                            {u.name.charAt(0).toUpperCase()}
                          </div>
                        )}
                        <div>
                          <div className="font-semibold text-sm text-white flex items-center gap-2">
                            {u.name}
                            <span
                              className={`text-[9px] font-mono-data uppercase px-1.5 py-0.5 border ${
                                u.role === "admin"
                                  ? "bg-rose-500/10 text-rose-400 border-rose-500/30"
                                  : "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                              }`}
                            >
                              {u.role}
                            </span>
                          </div>
                          <div className="text-xs text-slate-400 font-mono-data mt-0.5">{u.email}</div>
                        </div>
                      </div>
                      <span className={`material-symbols-outlined text-base ${isSelected ? "text-white" : "text-slate-600"}`}>
                        chevron_right
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Right Column: User Subscriptions & Feature Usage Buttons */}
          <div className="lg:col-span-2 space-y-4">
            <h2 className="text-lg font-light text-white flex items-center gap-2">
              <span className="material-symbols-outlined text-slate-400 text-xl">layers</span>
              {selectedUser ? `${selectedUser.name}'s Active Subscriptions` : "Subscriptions & Features"}
            </h2>

            {!selectedUser ? (
              <div className="border border-[#1e293b] p-12 text-center bg-[#181b25]/60 space-y-3">
                <span className="material-symbols-outlined text-slate-600 mb-1 block" style={{ fontSize: "40px" }}>
                  person
                </span>
                <h3 className="text-base font-light text-white">Select a user from the list</h3>
                <p className="text-xs text-slate-400 font-mono-data max-w-sm mx-auto">
                  Click on any user on the left sidebar to reveal their active plan subscriptions and feature loggers.
                </p>
              </div>
            ) : isLoadingSubs ? (
              <LoadingSpinner label={`Fetching subscriptions for ${selectedUser.name}...`} />
            ) : userSubscriptions.filter((s) => s.is_active).length === 0 ? (
              <div className="border border-[#1e293b] p-8 text-center bg-[#181b25] text-slate-400 font-mono-data text-xs">
                This user has no active subscriptions.
              </div>
            ) : (
              <div className="space-y-6">
                {userSubscriptions
                  .filter((sub: SubscriptionResponse) => sub.is_active)
                  .map((sub: SubscriptionResponse) => (
                    <div
                      key={sub.id}
                      className="border border-[#1e293b] p-6 bg-[#181b25] space-y-6"
                    >
                      {/* Subscription Title & Meta */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[#1e293b]">
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="text-xl font-light text-white">{sub.plan.name}</h3>
                            <span className="text-xs font-mono-data text-slate-400 border border-[#1e293b] px-2 py-0.5 bg-[#0b0f19]">
                              Sub #{sub.id}
                            </span>
                          </div>
                          <p className="text-xs text-slate-400 font-mono-data mt-1">
                            Monthly Fee: <span className="text-white font-bold">${sub.plan.monthly_fee}</span> • Billed on Day {sub.billing_day}
                          </p>
                        </div>

                        <div>
                          <span className="inline-flex items-center gap-1.5 border border-emerald-500/30 px-2.5 py-0.5 text-[10px] text-emerald-400 uppercase font-mono-data bg-emerald-500/10">
                            <span className="material-symbols-outlined text-xs">check_circle</span> ACTIVE
                          </span>
                        </div>
                      </div>

                      {/* Features List with Log Buttons */}
                      <div className="space-y-4">
                        <h4 className="text-xs font-mono-data uppercase tracking-wider text-slate-400 flex items-center gap-2">
                          <span className="material-symbols-outlined text-white text-base">bolt</span>
                          Included Plan Features &amp; Live Usage
                        </h4>

                        {sub.plan.features && sub.plan.features.length > 0 ? (
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {sub.plan.features.map((feat: FeatureResponse) => {
                              const loggedUnits = getLoggedUnits(sub.id, feat.id);
                              const isOverused = loggedUnits > feat.max_unit_limit;

                              return (
                                <div
                                  key={feat.id}
                                  className="p-4 border border-[#1e293b] bg-[#0b0f19] flex flex-col justify-between gap-4 hover:border-slate-500 transition-colors"
                                >
                                  <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                      <span className="font-medium text-sm text-white">{feat.name}</span>
                                      <span className="text-[10px] font-mono-data text-slate-500 uppercase">{feat.code}</span>
                                    </div>
                                    <div className="text-xs text-slate-400 flex items-center justify-between font-mono-data">
                                      <span>Current Usage:</span>
                                      <span className={`font-bold ${isOverused ? "text-amber-400" : "text-emerald-400"}`}>
                                        {loggedUnits} / {feat.max_unit_limit} units
                                      </span>
                                    </div>
                                    <div className="text-[11px] text-slate-500 font-mono-data">
                                      Overuse Rate: ${feat.unit_price} / exceeded unit
                                    </div>
                                  </div>

                                  <button
                                    onClick={() => openLogModal(sub.id, feat, sub.plan.name)}
                                    className="w-full py-2 px-3 border border-[#1e293b] hover:border-white text-white text-xs font-semibold uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer bg-[#181b25]"
                                  >
                                    <span className="material-symbols-outlined text-sm">monitoring</span>
                                    Log Feature Usage
                                  </button>
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <p className="text-xs text-slate-500 font-mono-data italic">No features attached to this plan.</p>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Record Usage Modal */}
      <RecordUsageModal
        isOpen={activeModalState.isOpen}
        onClose={() => setActiveModalState((prev) => ({ ...prev, isOpen: false }))}
        subscriptionId={activeModalState.subscriptionId}
        feature={activeModalState.feature}
        user={selectedUser}
        planName={activeModalState.planName}
      />
    </div>
  );
};
