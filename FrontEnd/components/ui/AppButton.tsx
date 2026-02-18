"use client";

import { Button, ButtonGroup } from "flowbite-react";

export function AppButton() {
  return (
    // Tambahkan div pembungkus dengan class 'flex justify-center'
    <div className="flex justify-center w-full">
      <ButtonGroup>
        <Button color="cyan">Reach Us</Button>
      </ButtonGroup>
    </div>
  );
}
