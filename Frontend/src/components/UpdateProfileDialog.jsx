import React, { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog'
import { Label } from './ui/label'
import { Input } from './ui/input'
import { Button } from './ui/button'
import { Loader2 } from 'lucide-react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { USER_API_END_POINT } from '@/utils/constant'
import { setUser } from '@/redux/authSlice'
import { toast } from 'sonner'

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.join(", ") || "",  // Skills as a comma-separated string
        file: user?.profile?.resume || ""
    });

    const dispatch = useDispatch();

    // Sync input state with user data when the dialog opens (in case the user data changes)
    useEffect(() => {
        if (user) {
            setInput({
                fullname: user?.fullname || "",
                email: user?.email || "",
                phoneNumber: user?.phoneNumber || "",
                bio: user?.profile?.bio || "",
                skills: user?.profile?.skills?.join(", ") || "",
                file: user?.profile?.resume || ""
            });
        }
    }, [user]);

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    }

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, file })
    }
const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("fullname", input.fullname);
    formData.append("email", input.email);
    formData.append("phoneNumber", input.phoneNumber);
    formData.append("bio", input.bio);
    formData.append("skills", input.skills.split(",").map(skill => skill.trim()));

    if (input.file) {
        formData.append("file", input.file);
    }

    try {
        console.log("Submitting form...");  // Debugging log
        setLoading(true);

        // Add timeout of 10 seconds to the request to avoid it hanging
        const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            },
            withCredentials: true,
            timeout: 10000  // 10 seconds timeout
        });

        // Check the response
        console.log("API Response:", res);

        if (res.data.success) {
            dispatch(setUser(res.data.user));
            toast.success(res.data.message);
        } else {
            toast.error('Something went wrong, please try again.');
        }
    } catch (error) {
        console.error('Error in profile update request:', error);

        if (error.response) {
            toast.error(error.response?.data?.message || 'An error occurred. Please try again.');
        } else if (error.request) {
            // The request was made but no response was received
            toast.error('No response from the server. Please try again later.');
        } else {
            // Something happened in setting up the request
            toast.error('Error in setting up the request.');
        }
    } finally {
        console.log('Finally block executed'); // Debugging log
        setLoading(false);  // Clear the loading state
    }

    setOpen(false);
    console.log(input);
};

    return (
        <div>
            <Dialog open={open}>
                <DialogContent className="sm:max-w-[425px]" onInteractOutside={() => setOpen(false)}>
                    <DialogHeader>
                        <DialogTitle>Update Profile</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={submitHandler}>
                        <div className='grid gap-4 py-4'>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="fullname" className="text-right">Name</Label>
                                <Input
                                    id="fullname"
                                    name="fullname"  // Use 'fullname' here
                                    type="text"
                                    value={input.fullname}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="email" className="text-right">Email</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={input.email}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="phoneNumber" className="text-right">Number</Label>
                                <Input
                                    id="phoneNumber"
                                    name="phoneNumber"  // Ensure this is 'phoneNumber' here
                                    value={input.phoneNumber}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="bio" className="text-right">Bio</Label>
                                <Input
                                    id="bio"
                                    name="bio"
                                    value={input.bio}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="skills" className="text-right">Skills</Label>
                                <Input
                                    id="skills"
                                    name="skills"
                                    value={input.skills}
                                    onChange={changeEventHandler}
                                    className="col-span-3"
                                />
                            </div>
                            <div className='grid grid-cols-4 items-center gap-4'>
                                <Label htmlFor="file" className="text-right">Resume</Label>
                                <Input
                                    id="file"
                                    name="file"
                                    type="file"
                                    accept="application/pdf"
                                    onChange={fileChangeHandler}
                                    className="col-span-3"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            {loading
                                ? <Button className="w-full my-4"><Loader2 className='mr-2 h-4 w-4 animate-spin' /> Please wait</Button>
                                : <Button type="submit" className="w-full my-4">Update</Button>}
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default UpdateProfileDialog
