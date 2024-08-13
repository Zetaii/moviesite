import React from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

interface CollectionFormProps {
  title: string
  description: string
  setTitle: (title: string) => void
  setDescription: (description: string) => void
  handleSave: () => void
}

const CollectionForm: React.FC<CollectionFormProps> = ({
  title,
  description,
  setTitle,
  setDescription,
  handleSave,
}) => (
  <Dialog>
    <DialogTrigger asChild>
      <Button variant="outline" className="bg-blue-600">
        Create a new movie collection
      </Button>
    </DialogTrigger>
    <DialogContent className="sm:max-w-[425px] bg-slate-900">
      <DialogHeader>
        <DialogTitle className="text-white">Movie Collection</DialogTitle>
        <DialogDescription>
          Create your own movie collection and add your favorite movies.
        </DialogDescription>
      </DialogHeader>
      <div className="grid gap-4 py-4">
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="title" className="text-right text-white">
            Title
          </Label>
          <Input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="col-span-3"
          />
        </div>
        <div className="grid grid-cols-4 items-center gap-4">
          <Label htmlFor="description" className="text-right text-white">
            Description
          </Label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="col-span-3 p-2 border rounded"
            rows={4}
            placeholder="Enter a description"
          />
        </div>
      </div>
      <DialogFooter>
        <Button type="button" onClick={handleSave}>
          Save changes
        </Button>
      </DialogFooter>
    </DialogContent>
  </Dialog>
)

export default CollectionForm
