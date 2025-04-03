
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useHealthCare } from "@/context/HealthCareContext";
import { User } from "@/types";

export function ProfileMenu() {
  const { user, toggleProfileMenu } = useHealthCare();
  
  return (
    <div className="bg-white rounded-md shadow-md p-3 w-full max-w-xs animate-fade-in">
      <div className="text-center mb-2">
        {user ? (
          <div>
            <h3 className="font-bold">{user.name}</h3>
            <p className="text-sm text-gray-600">{user.age} years old</p>
          </div>
        ) : (
          <p className="text-sm text-gray-600">No profile data</p>
        )}
      </div>
      
      <div className="flex gap-2 justify-center">
        <ProfileDialog />
        <Button variant="secondary" size="sm" onClick={toggleProfileMenu}>
          Close
        </Button>
      </div>
    </div>
  );
}

export function ProfileDialog() {
  const { user, setUser } = useHealthCare();
  const [formData, setFormData] = useState<User>({
    name: user?.name || "",
    age: user?.age || 0,
    preferences: user?.preferences || ""
  });
  const [open, setOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser(formData);
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? parseInt(value) || 0 : value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" size="sm">
          {user ? 'Edit Profile' : 'Create Profile'}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{user ? 'Edit Profile' : 'Create Profile'}</DialogTitle>
          <DialogDescription>
            Enter your information below to update your profile.
          </DialogDescription>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="age">Age</Label>
            <Input
              id="age"
              name="age"
              type="number"
              placeholder="Your age"
              value={formData.age || ''}
              onChange={handleChange}
              required
              min={1}
              max={120}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="preferences">Health Preferences (Optional)</Label>
            <Input
              id="preferences"
              name="preferences"
              placeholder="e.g., Diet, Exercise goals, Health conditions"
              value={formData.preferences}
              onChange={handleChange}
            />
          </div>
          
          <Button type="submit" className="w-full">
            Save Profile
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
