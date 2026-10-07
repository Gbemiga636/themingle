"use client";

import { QRCodeSVG } from "qrcode.react";

export function TicketQr({ value }: { value: string }) {
  return (
    <div className="qr">
      <QRCodeSVG value={value} size={148} bgColor="#f3eee6" fgColor="#0c0b0a" />
    </div>
  );
}
