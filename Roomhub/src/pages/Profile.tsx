import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { User, Settings, Calendar, Clock, Bell, Home, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UserProfilePanel from '@/components/profile/UserProfilePanel';
import { useToast } from '@/hooks/use-toast';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch user data
  const { data: userData, isLoading, error } = useQuery({
    queryKey: ['/api/users/1'],
    queryFn: async () => {
      // Since we don't have a real user endpoint, return mock data
      return {
        id: 1,
        username: 'demouser',
        displayName: 'Roommate A',
        email: 'roommate.a@example.com',
        preferences: {
          preferredTimes: {
            kitchen: ['morning', 'evening'],
            bathroom: ['morning'],
            livingRoom: ['evening'],
            laundry: ['weekend']
          },
          notificationPreferences: {
            email: true,
            inApp: true
          },
          theme: 'light'
        }
      };
    }
  });

  // Update user profile
  const updateProfile = useMutation({
    mutationFn: (data) => {
      // Simulate API call since we don't have a real endpoint
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({ ...userData, ...data });
        }, 500);
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/users/1'] });
      setIsEditing(false);
      toast({
        title: 'Profile updated',
        description: 'Your profile has been successfully updated.',
      });
    },
    onError: (error) => {
      toast({
        variant: 'destructive',
        title: 'Error updating profile',
        description: error.message || 'There was an error updating your profile.',
      });
    }
  });

  const handleSaveProfile = (data) => {
    updateProfile.mutate(data);
  };

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="animate-pulse space-y-4">
          <div className="h-10 bg-gray-200 rounded w-48"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl font-bold mb-6 text-[#333333]">Profile</h1>
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>
            Failed to load profile. {error.message}
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Fetch reminders for this user
  const { data: reminders } = useQuery({
    queryKey: ['/api/reminders'],
  });

  // Calculate stats
  const getReminderStats = () => {
    if (!reminders) return { sent: 0, received: 0, pending: 0, completed: 0 };
    
    const sent = reminders.filter(r => r.fromUser === userData.displayName).length;
    const received = reminders.filter(r => r.fromUser !== userData.displayName).length;
    const pending = reminders.filter(r => !r.completed).length;
    const completed = reminders.filter(r => r.completed).length;
    
    return { sent, received, pending, completed };
  };

  const reminderStats = getReminderStats();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <h1 className="text-2xl font-bold mb-6 text-[#333333]">Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="md:col-span-1">
          <CardHeader className="pb-2">
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Your account details and preferences</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center mb-6">
              <div className="h-24 w-24 rounded-full bg-[#7A8450] flex items-center justify-center text-white text-2xl font-bold mb-4">
                {userData.displayName[0]}
              </div>
              <h2 className="text-xl font-semibold">{userData.displayName}</h2>
              <p className="text-gray-500">{userData.email}</p>
            </div>

            <Button 
              onClick={() => setIsEditing(true)} 
              className="w-full bg-[#7A8450] hover:bg-[#556B2F]"
            >
              <Settings className="mr-2 h-4 w-4" />
              Edit Profile
            </Button>
          </CardContent>
        </Card>

        {/* Main Content Area */}
        <div className="md:col-span-2">
          <Tabs defaultValue="preferences">
            <TabsList className="grid grid-cols-2 mb-4">
              <TabsTrigger value="preferences" className="data-[state=active]:bg-[#FAF3E0] data-[state=active]:text-[#556B2F]">
                Preferences
              </TabsTrigger>
              <TabsTrigger value="stats" className="data-[state=active]:bg-[#FAF3E0] data-[state=active]:text-[#556B2F]">
                Activity & Stats
              </TabsTrigger>
            </TabsList>

            <TabsContent value="preferences">
              <UserProfilePanel 
                userData={userData} 
                isEditing={isEditing}
                onSave={handleSaveProfile}
                onCancel={() => setIsEditing(false)}
              />
            </TabsContent>

            <TabsContent value="stats">
              <Card>
                <CardHeader>
                  <CardTitle>Activity Statistics</CardTitle>
                  <CardDescription>Your usage and activity on RoomSync</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#FAF3E0] p-4 rounded-lg">
                      <div className="flex items-start">
                        <Bell className="h-5 w-5 mr-2 text-[#7A8450]" />
                        <div>
                          <h3 className="font-medium">Reminders</h3>
                          <ul className="mt-2 space-y-1 text-sm">
                            <li className="flex justify-between">
                              <span>Sent:</span>
                              <span className="font-medium">{reminderStats.sent}</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Received:</span>
                              <span className="font-medium">{reminderStats.received}</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Pending:</span>
                              <span className="font-medium">{reminderStats.pending}</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Completed:</span>
                              <span className="font-medium">{reminderStats.completed}</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="bg-[#FAF3E0] p-4 rounded-lg">
                      <div className="flex items-start">
                        <Calendar className="h-5 w-5 mr-2 text-[#7A8450]" />
                        <div>
                          <h3 className="font-medium">Schedule Usage</h3>
                          <ul className="mt-2 space-y-1 text-sm">
                            <li className="flex justify-between">
                              <span>Kitchen:</span>
                              <span className="font-medium">5 times</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Living Room:</span>
                              <span className="font-medium">8 times</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Bathroom:</span>
                              <span className="font-medium">14 times</span>
                            </li>
                            <li className="flex justify-between">
                              <span>Laundry:</span>
                              <span className="font-medium">2 times</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 bg-[#FAF3E0] p-4 rounded-lg">
                    <h3 className="font-medium flex items-center mb-3">
                      <Clock className="h-5 w-5 mr-2 text-[#7A8450]" />
                      Popular Usage Times
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-medium mb-2">Kitchen</h4>
                        <div className="h-4 bg-[#DCCCA3] rounded-full mb-1 relative">
                          <div className="absolute inset-0 bg-[#7A8450] rounded-full" style={{ width: '75%' }}></div>
                        </div>
                        <p className="text-xs text-right">Evenings (5pm - 8pm)</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-medium mb-2">Bathroom</h4>
                        <div className="h-4 bg-[#DCCCA3] rounded-full mb-1 relative">
                          <div className="absolute inset-0 bg-[#7A8450] rounded-full" style={{ width: '90%' }}></div>
                        </div>
                        <p className="text-xs text-right">Mornings (6am - 8am)</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Profile;
