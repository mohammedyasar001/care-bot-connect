
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useHealthCare } from "@/context/HealthCareContext";
import { Appointment } from "@/types";

export function AppointmentDialog({ children }: { children: React.ReactNode }) {
  const { addAppointment } = useHealthCare();
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Appointment>({
    date: "",
    time: "",
    reason: ""
  });
  const [errors, setErrors] = useState({
    date: "",
    time: "",
    reason: ""
  });

  const validateForm = () => {
    let valid = true;
    const newErrors = {
      date: "",
      time: "",
      reason: ""
    };

    if (!formData.date) {
      newErrors.date = "Date is required";
      valid = false;
    }

    if (!formData.time) {
      newErrors.time = "Time is required";
      valid = false;
    }

    if (!formData.reason) {
      newErrors.reason = "Reason is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    addAppointment(formData);
    setFormData({
      date: "",
      time: "",
      reason: ""
    });
    setOpen(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Schedule Appointment</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4 mt-2">
          <div className="space-y-2">
            <Label htmlFor="date">Date (YYYY-MM-DD)</Label>
            <Input
              id="date"
              name="date"
              type="date"
              value={formData.date}
              onChange={handleChange}
              required
            />
            {errors.date && <p className="text-red-500 text-xs">{errors.date}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="time">Time</Label>
            <Input
              id="time"
              name="time"
              type="time"
              value={formData.time}
              onChange={handleChange}
              required
            />
            {errors.time && <p className="text-red-500 text-xs">{errors.time}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Appointment</Label>
            <Textarea
              id="reason"
              name="reason"
              placeholder="Describe your symptoms or reason for visit"
              value={formData.reason}
              onChange={handleChange}
              required
              className="min-h-[100px]"
            />
            {errors.reason && <p className="text-red-500 text-xs">{errors.reason}</p>}
          </div>
          
          <Button type="submit" className="w-full">
            Schedule Appointment
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
