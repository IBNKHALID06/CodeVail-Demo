"use client"

import { useState } from "react"
import { useAuth } from "../contexts/AuthContext"
import { useTheme } from "../contexts/ThemeContext"
import { Sidebar } from "../components/Sidebar"
import { User, Mail, Calendar, Shield, Camera, Edit2, Save, X } from "lucide-react"

export default function Profile() {
  const { user } = useAuth()
  const { theme } = useTheme()
  const [isEditing, setIsEditing] = useState(false)
  const [editedUser, setEditedUser] = useState({
    name: user?.name || "",
    email: user?.email || "",
    bio: "Software developer passionate about creating efficient solutions.",
    location: "New York, NY",
    phone: "+1 (555) 123-4567",
  })

  const handleSave = () => {
    // Here you would typically save to your backend
    console.log("Saving user data:", editedUser)
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditedUser({
      name: user?.name || "",
      email: user?.email || "",
      bio: "Software developer passionate about creating efficient solutions.",
      location: "New York, NY", 
      phone: "+1 (555) 123-4567",
    })
    setIsEditing(false)
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar activeItem="profile" />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Profile</h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">Manage your account settings and preferences</p>
          </div>

          {/* Profile Card */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Profile Header */}
            <div className="relative bg-gradient-to-r from-blue-500 to-purple-600 h-32">
              <div className="absolute -bottom-16 left-8">
                <div className="relative">
                  <img
                    src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=3b82f6&color=fff`}
                    alt={user?.name}
                    className="w-32 h-32 rounded-full border-4 border-white dark:border-gray-800 shadow-lg"
                  />
                  <button className="absolute bottom-2 right-2 bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-full shadow-lg transition-colors">
                    <Camera size={16} />
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Content */}
            <div className="pt-20 p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{user?.name}</h2>
                  <p className="text-gray-600 dark:text-gray-400 capitalize">{user?.role}</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Shield className="text-green-500" size={16} />
                    <span className="text-sm text-green-600 dark:text-green-400">Verified Account</span>
                  </div>
                </div>
                
                {!isEditing ? (
                  <button
                    onClick={() => setIsEditing(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
                  >
                    <Edit2 size={16} />
                    Edit Profile
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
                    >
                      <Save size={16} />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg transition-colors"
                    >
                      <X size={16} />
                      Cancel
                    </button>
                  </div>
                )}
              </div>

              {/* Profile Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Full Name
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.name}
                        onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <User size={16} className="text-gray-500" />
                        <span className="text-gray-900 dark:text-white">{user?.name}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Email Address
                    </label>
                    {isEditing ? (
                      <input
                        type="email"
                        value={editedUser.email}
                        onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <Mail size={16} className="text-gray-500" />
                        <span className="text-gray-900 dark:text-white">{user?.email}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Phone Number
                    </label>
                    {isEditing ? (
                      <input
                        type="tel"
                        value={editedUser.phone}
                        onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-gray-900 dark:text-white">{editedUser.phone}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Location
                    </label>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedUser.location}
                        onChange={(e) => setEditedUser({ ...editedUser, location: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    ) : (
                      <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-gray-900 dark:text-white">{editedUser.location}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Bio
                    </label>
                    {isEditing ? (
                      <textarea
                        value={editedUser.bio}
                        onChange={(e) => setEditedUser({ ...editedUser, bio: e.target.value })}
                        rows={4}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                      />
                    ) : (
                      <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                        <span className="text-gray-900 dark:text-white">{editedUser.bio}</span>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Member Since
                    </label>
                    <div className="flex items-center gap-2 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <Calendar size={16} className="text-gray-500" />
                      <span className="text-gray-900 dark:text-white">January 2024</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
