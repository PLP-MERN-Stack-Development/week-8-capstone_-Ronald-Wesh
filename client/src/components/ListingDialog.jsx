
import {
    Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogDescription,
    DialogFooter, DialogClose
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Plus, Camera } from "lucide-react";
import { useState } from "react";

export default function ListingDialog({ onSubmit }) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [address, setAddress] = useState("");
    const [images, setImages] = useState([]);
    const [imageInput, setImageInput] = useState("");

    const handleCreate = () => {
        if (!title.trim() || !description.trim() || !address.trim()) {
            alert("Please fill in all required fields");
            return;
        }

        onSubmit({
            title: title.trim(),
            description: description.trim(),
            address: address.trim(),
            images: images.filter(img => img.trim() !== "")
        });

        setTitle("");
        setDescription("");
        setAddress("");
        setImages([]);
        setImageInput("");
    };

    const handleAddImage = () => {
        if (imageInput.trim() && !images.includes(imageInput.trim())) {
            setImages([...images, imageInput.trim()]);
            setImageInput("");
        }
    };

    const handleRemoveImage = (index) => {
        setImages(images.filter((_, i) => i !== index));
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && e.target === e.currentTarget) {
            e.preventDefault();
            handleAddImage();
        }
    };

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add Listing
                </Button>
            </DialogTrigger>

            <DialogContent className="max-w-md max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>New Property Listing</DialogTitle>
                    <DialogDescription>
                        Create a new property listing by providing the details below. All fields marked with * are required.
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4">
                    <div>
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Title *
                        </label>
                        <Input
                            placeholder="e.g., Spacious 2BR Apartment in Downtown"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Address *
                        </label>
                        <Input
                            placeholder="e.g., 123 Main Street, City, State"
                            value={address}
                            onChange={e => setAddress(e.target.value)}
                            className="mt-1"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300">
                            Description *
                        </label>
                        <Textarea
                            placeholder="Describe the property, amenities, and any important details..."
                            className="mt-1 min-h-[100px]"
                            value={description}
                            onChange={e => setDescription(e.target.value)}
                        />
                    </div>

                    <div>
                        <label className="text-sm font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                            <Camera className="h-4 w-4" />
                            Property Images
                        </label>
                        <div className="mt-1 space-y-2">
                            <div className="flex gap-2">
                                <Input
                                    placeholder="Enter image URL"
                                    value={imageInput}
                                    onChange={e => setImageInput(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    className="flex-1"
                                />
                                <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={handleAddImage}
                                    disabled={!imageInput.trim()}
                                >
                                    Add
                                </Button>
                            </div>

                            {images.length > 0 && (
                                <div className="space-y-1">
                                    <p className="text-xs text-zinc-500">{images.length} image(s) added:</p>
                                    {images.map((img, index) => (
                                        <div key={index} className="flex items-center justify-between bg-zinc-50 dark:bg-zinc-800 p-2 rounded text-sm">
                                            <span className="truncate flex-1 mr-2">{img}</span>
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => handleRemoveImage(index)}
                                                className="h-6 w-6 p-0 text-zinc-500 hover:text-red-500"
                                            >
                                                ×
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <DialogFooter className="mt-6">
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <DialogClose asChild>
                        <Button onClick={handleCreate}>Create Listing</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}