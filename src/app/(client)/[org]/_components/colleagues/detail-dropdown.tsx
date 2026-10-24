"use client";

import { ChevronRight } from "lucide-react";
import React, { useState, useRef, useEffect, useContext } from "react";
import { ACTIONS } from "~/store/Actions";
import { DataContext } from "~/store/GlobalState";
import { showError, showSuccess } from "~/components/toast/sonner";
import {
  buildProfileLink,
  copyToClipboard,
  getDisplayName,
  getMemberId,
} from "~/utils/clipboard";

interface MenuDropdownProps {
  isOpen: boolean;
  onClose: () => void;
  deleteModal: () => void;
  user?: any;
}

interface SubMenuState {
  copy: boolean;
}

const DetailDropdown = ({
  isOpen,
  onClose,
  deleteModal,
  user,
}: MenuDropdownProps) => {
  const [subMenus, setSubMenus] = useState<SubMenuState>({
    copy: false,
  });
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { dispatch } = useContext(DataContext);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if click target is inside a dialog
      const isInsideDialog = (event.target as Element).closest(
        '[role="dialog"]'
      );
      if (isInsideDialog) return;

      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  if (!isOpen) return null;

  const handleCopy = async (value: string, label: string) => {
    const copied = await copyToClipboard(value);
    if (copied) {
      showSuccess(`${label} copied to clipboard`);
    } else {
      showError(`Failed to copy ${label.toLowerCase()}`);
    }
    onClose();
  };

  const handleSearch = () => {
    dispatch({ type: ACTIONS.CONVERSATION_SEARCH_OPEN, payload: true });
    onClose();
  };

  const handleOpenInNewWindow = () => {
    window.open(window.location.href, "_blank", "noopener,noreferrer");
    onClose();
  };

  const menuItemClass =
    "px-4 py-2 text-[15px] text-[#101828] hover:bg-[#F1F1FE] flex items-center justify-between cursor-pointer";
  const dividerClass = "h-px bg-[#E6EAEF]";

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full right-0 w-[220px] mt-2.5 bg-white rounded-[7px] shadow-lg border border-[#E6EAEF] z-20"
    >
      <div>
        <div className={dividerClass} />

        <div
          className={`${menuItemClass} relative`}
          onMouseEnter={() => setSubMenus({ copy: true })}
          onMouseLeave={() => setSubMenus({ copy: false })}
        >
          Copy
          <ChevronRight className="w-4 h-4" color="#343330" />
          {subMenus.copy && (
            <div className="absolute right-full top-0 w-[200px] bg-white rounded-[7px] shadow-lg border border-[#E6EAEF]">
              <div
                className={menuItemClass}
                onClick={() => handleCopy(getDisplayName(user), "Display name")}
              >
                Copy display name
              </div>
              <div
                className={menuItemClass}
                onClick={() => handleCopy(getMemberId(user), "Member ID")}
              >
                Copy member ID
              </div>
              <div
                className={menuItemClass}
                onClick={() =>
                  handleCopy(buildProfileLink(user), "Profile link")
                }
              >
                Copy link to profile
              </div>
            </div>
          )}
        </div>
        <div className={menuItemClass} onClick={handleSearch}>
          Search in conversation
        </div>

        <div className={menuItemClass} onClick={handleOpenInNewWindow}>
          Open in new window
        </div>

        <div className={dividerClass} />

        <div
          className={`${menuItemClass} text-[#B00E03]`}
          onClick={() => deleteModal()}
        >
          Delete Colleague
        </div>
      </div>
    </div>
  );
};

export default DetailDropdown;
