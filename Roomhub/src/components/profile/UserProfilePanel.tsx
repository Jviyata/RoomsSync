import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Clock, Bell, Moon, Mail, Home } from 'lucide-react';

const UserProfilePanel = ({ userData, isEditing, onSave, onCancel }) => {
  const { register, handleSubmit, formState: { errors }, setValue } = useForm({
    defaultValues: {
      displayName: userData?.displayName || '',
      email: userData?.email || '',
      notifyEmail: userData?.preferences?.notificationPreferences?.email || false,
      notifyInApp: userData?.preferences?.notificationPreferences?.inApp || false,
      theme: userData?.preferences?.theme || 'light',
      preferKitchenMorning: userData?.preferences?.preferredTimes?.kitchen?.includes('morning') || false,
      preferKitchenAfternoon: userData?.preferences?.preferredTimes?.kitchen?.includes('afternoon') || false,
      preferKitchenEvening: userData?.preferences?.preferredTimes?.kitchen?.includes('evening') || false,
      preferBathroomMorning: userData?.preferences?.preferredTimes?.bathroom?.includes('morning') || false,
      preferBathroomEvening: userData?.preferences?.preferredTimes?.bathroom?.includes('evening') || false,
      preferLivingRoomEvening: userData?.preferences?.preferredTimes?.livingRoom?.includes('evening') || false,
      preferLaundryWeekend: userData?.preferences?.preferredTimes?.laundry?.includes('weekend') || false,
    }
  });

  const handleFormSubmit = (data) => {
    // Transform form data back to user data structure
    const updatedUserData = {
      ...userData,
      displayName: data.displayName,
      email: data.email,
      preferences: {
        preferredTimes: {
          kitchen: [
            ...(data.preferKitchenMorning ? ['morning'] : []),
            ...(data.preferKitchenAfternoon ? ['afternoon'] : []),
            ...(data.preferKitchenEvening ? ['evening'] : [])
          ],
          bathroom: [
            ...(data.preferBathroomMorning ? ['morning'] : []),
            ...(data.preferBathroomEvening ? ['evening'] : [])
          ],
          livingRoom: [
            ...(data.preferLivingRoomEvening ? ['evening'] : [])
          ],
          laundry: [
            ...(data.preferLaundryWeekend ? ['weekend'] : [])
          ]
        },
        notificationPreferences: {
          email: data.notifyEmail,
          inApp: data.notifyInApp
        },
        theme: data.theme
      }
    };

    onSave(updatedUserData);
  };

  if (!userData) {
    return <div>Loading profile data...</div>;
  }

  // Display mode (not editing)
  if (!isEditing) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium flex items-center mb-3">
                <Home className="mr-2 h-5 w-5 text-[#7A8450]" />
                Preferred Space Usage Times
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#FAF3E0] p-3 rounded-lg">
                  <h4 className="font-medium">Kitchen</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {userData.preferences?.preferredTimes?.kitchen?.map(time => (
                      <span key={time} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#DCCCA3] text-[#556B2F]">
                        {time.charAt(0).toUpperCase() + time.slice(1)}
                      </span>
                    ))}
                    {!userData.preferences?.preferredTimes?.kitchen?.length && (
                      <span className="text-sm text-gray-500">No preferences set</span>
                    )}
                  </div>
                </div>
                <div className="bg-[#FAF3E0] p-3 rounded-lg">
                  <h4 className="font-medium">Bathroom</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {userData.preferences?.preferredTimes?.bathroom?.map(time => (
                      <span key={time} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#DCCCA3] text-[#556B2F]">
                        {time.charAt(0).toUpperCase() + time.slice(1)}
                      </span>
                    ))}
                    {!userData.preferences?.preferredTimes?.bathroom?.length && (
                      <span className="text-sm text-gray-500">No preferences set</span>
                    )}
                  </div>
                </div>
                <div className="bg-[#FAF3E0] p-3 rounded-lg">
                  <h4 className="font-medium">Living Room</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {userData.preferences?.preferredTimes?.livingRoom?.map(time => (
                      <span key={time} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#DCCCA3] text-[#556B2F]">
                        {time.charAt(0).toUpperCase() + time.slice(1)}
                      </span>
                    ))}
                    {!userData.preferences?.preferredTimes?.livingRoom?.length && (
                      <span className="text-sm text-gray-500">No preferences set</span>
                    )}
                  </div>
                </div>
                <div className="bg-[#FAF3E0] p-3 rounded-lg">
                  <h4 className="font-medium">Laundry</h4>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {userData.preferences?.preferredTimes?.laundry?.map(time => (
                      <span key={time} className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-[#DCCCA3] text-[#556B2F]">
                        {time.charAt(0).toUpperCase() + time.slice(1)}
                      </span>
                    ))}
                    {!userData.preferences?.preferredTimes?.laundry?.length && (
                      <span className="text-sm text-gray-500">No preferences set</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium flex items-center mb-3">
                <Bell className="mr-2 h-5 w-5 text-[#7A8450]" />
                Notification Preferences
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 bg-[#FAF3E0] rounded-lg">
                  <div className="flex items-center">
                    <Mail className="h-5 w-5 mr-2 text-[#7A8450]" />
                    <span>Email Notifications</span>
                  </div>
                  <span className={userData.preferences?.notificationPreferences?.email ? "text-[#7A8450]" : "text-gray-500"}>
                    {userData.preferences?.notificationPreferences?.email ? "Enabled" : "Disabled"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#FAF3E0] rounded-lg">
                  <div className="flex items-center">
                    <Bell className="h-5 w-5 mr-2 text-[#7A8450]" />
                    <span>In-App Notifications</span>
                  </div>
                  <span className={userData.preferences?.notificationPreferences?.inApp ? "text-[#7A8450]" : "text-gray-500"}>
                    {userData.preferences?.notificationPreferences?.inApp ? "Enabled" : "Disabled"}
                  </span>
                </div>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-medium flex items-center mb-3">
                <Moon className="mr-2 h-5 w-5 text-[#7A8450]" />
                Display Preferences
              </h3>
              <div className="p-3 bg-[#FAF3E0] rounded-lg">
                <div className="flex items-center justify-between">
                  <span>Theme</span>
                  <span className="text-[#7A8450]">
                    {userData.preferences?.theme === 'dark' ? 'Dark' : 'Light'}
                  </span>
                </div>
              </div>
            </div>

            <Button 
              onClick={() => onSave(userData)}
              className="w-full bg-[#7A8450] hover:bg-[#556B2F]"
            >
              Save Changes
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Edit mode
  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="displayName">Display Name</Label>
              <Input
                id="displayName"
                {...register("displayName", { required: "Display name is required" })}
                className="border-[#7A8450] focus:ring-[#7A8450]"
              />
              {errors.displayName && (
                <p className="text-red-500 text-sm mt-1">{errors.displayName.message}</p>
              )}
            </div>

            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                {...register("email", { 
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  }
                })}
                className="border-[#7A8450] focus:ring-[#7A8450]"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
              )}
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium flex items-center mb-3">
              <Home className="mr-2 h-5 w-5 text-[#7A8450]" />
              Preferred Space Usage Times
            </h3>
            
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Kitchen</h4>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="preferKitchenMorning"
                      {...register("preferKitchenMorning")}
                      className="accent-[#7A8450]"
                    />
                    <Label htmlFor="preferKitchenMorning">Morning</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="preferKitchenAfternoon"
                      {...register("preferKitchenAfternoon")}
                      className="accent-[#7A8450]"
                    />
                    <Label htmlFor="preferKitchenAfternoon">Afternoon</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="preferKitchenEvening"
                      {...register("preferKitchenEvening")}
                      className="accent-[#7A8450]"
                    />
                    <Label htmlFor="preferKitchenEvening">Evening</Label>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Bathroom</h4>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="preferBathroomMorning"
                      {...register("preferBathroomMorning")}
                      className="accent-[#7A8450]"
                    />
                    <Label htmlFor="preferBathroomMorning">Morning</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="preferBathroomEvening"
                      {...register("preferBathroomEvening")}
                      className="accent-[#7A8450]"
                    />
                    <Label htmlFor="preferBathroomEvening">Evening</Label>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Living Room</h4>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="preferLivingRoomEvening"
                      {...register("preferLivingRoomEvening")}
                      className="accent-[#7A8450]"
                    />
                    <Label htmlFor="preferLivingRoomEvening">Evening</Label>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Laundry</h4>
                <div className="flex flex-wrap gap-4">
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="preferLaundryWeekend"
                      {...register("preferLaundryWeekend")}
                      className="accent-[#7A8450]"
                    />
                    <Label htmlFor="preferLaundryWeekend">Weekend</Label>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium flex items-center mb-3">
              <Bell className="mr-2 h-5 w-5 text-[#7A8450]" />
              Notification Preferences
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Mail className="h-5 w-5 text-[#7A8450]" />
                  <Label htmlFor="notifyEmail">Email Notifications</Label>
                </div>
                <Switch
                  id="notifyEmail"
                  {...register("notifyEmail")}
                  checked={!!register("notifyEmail").value}
                  onCheckedChange={(checked) => setValue("notifyEmail", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Bell className="h-5 w-5 text-[#7A8450]" />
                  <Label htmlFor="notifyInApp">In-App Notifications</Label>
                </div>
                <Switch
                  id="notifyInApp"
                  {...register("notifyInApp")}
                  checked={!!register("notifyInApp").value}
                  onCheckedChange={(checked) => setValue("notifyInApp", checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          <div>
            <h3 className="text-lg font-medium flex items-center mb-3">
              <Moon className="mr-2 h-5 w-5 text-[#7A8450]" />
              Display Preferences
            </h3>
            <div className="p-3 bg-[#FAF3E0] rounded-lg">
              <div className="flex items-center justify-between">
                <Label htmlFor="theme">Theme</Label>
                <select
                  id="theme"
                  {...register("theme")}
                  className="p-2 border border-[#7A8450] rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-[#7A8450]"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                </select>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-2">
            <Button 
              type="button" 
              variant="outline" 
              onClick={onCancel}
              className="border-gray-300"
            >
              Cancel
            </Button>
            <Button 
              type="submit"
              className="bg-[#7A8450] hover:bg-[#556B2F]"
            >
              Save Changes
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default UserProfilePanel;
