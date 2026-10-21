import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "~/components/ui/dialog";

interface SignOutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

const SignOutModal = ({ open, onOpenChange, onConfirm }: SignOutModalProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md p-0 overflow-hidden">
        <DialogHeader>
          <DialogTitle className="border-b p-4 text-[#1D2939] text-xl font-semibold">
            Sign out?
          </DialogTitle>
        </DialogHeader>

        <div className="px-6 pb-6">
          <DialogDescription className="text-sm text-[#475467]">
            Are you sure you want to sign out of your account?
          </DialogDescription>

          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={() => onOpenChange(false)}
              className="px-4 py-2 rounded-md border border-[#D0D5DD] text-[#344054] text-sm font-medium hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={onConfirm}
              className="px-4 py-2 rounded-md bg-[#F81404] text-white text-sm font-semibold hover:bg-[#D91000]"
            >
              Sign Out
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SignOutModal;
