"use client";
import React, { useRef } from "react";
import { PDFDocument } from "pdf-lib";
import html2canvas from "html2canvas";
import Image from "next/image";
import formatDate from "../helpers/formatDate";

const Receipt = () => {
  const receiptRef = useRef<HTMLDivElement>(null);

  const generatePDF = async (): Promise<void> => {
    if (!receiptRef.current) return;

    try {
      const canvas = await html2canvas(receiptRef.current, { scale: 2 });
      const imageData = canvas.toDataURL("image/png");
      const pdfDoc = await PDFDocument.create();
      const page = pdfDoc.addPage([canvas.width, canvas.height]);
      const pngImage = await pdfDoc.embedPng(imageData);
      page.drawImage(pngImage, {
        x: 0,
        y: 0,
        width: canvas.width,
        height: canvas.height,
      });

      const pdfBytes = await pdfDoc.save();

      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const link = document.createElement("a");
      link.href = URL.createObjectURL(blob);
      link.download = "receipt.pdf";
      link.click();
    } catch (error) {
      console.error("Error generating PDF:", error);
    }
  };

  return (
    <div>
      <div
        ref={receiptRef}
        style={{
          width: "80mm",
          fontSize: "12px",
          padding: "10px",
          border: "1px solid #ddd",
          backgroundColor: "#fff",
        }}
      >
        <Image
          alt="Playdays Logo"
          src="./playdays-logo-bw.svg"
          className="mx-auto h-20 w-auto"
          width={18}
          height={18}
        />
        <p
          style={{
            fontSize: "12px",
            textAlign: "center",
            margin: "4px 0",
          }}
        >
          Jl. Parak Gadang No.57, Simpang Haru, Kec. Padang Tim., Kota Padang,
          Sumatera Barat
        </p>
        <div style={{ margin: "4px 0", fontSize: "10px", textAlign: "center" }}>
          <div>Senin - Kamis: 11.00 - 22.00</div>
          <div>Jumat - Minggu : 10.00 - 22.00</div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Image
            alt="instagram Logo"
            src="./ig-logo-bw.svg"
            width={10}
            height={10}
          />
          <p style={{ marginLeft: "4px" }}>playdays.pg</p>
        </div>
        <div>Tanggal: {formatDate(new Date().toISOString())}</div>
        <div>Nama Kasir: Tika</div>
        <hr style={{ marginTop: "8px", marginBottom: "8px" }} />
        <table style={{ width: "100%", marginBottom: "10px" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>Barang</th>
              <th style={{ textAlign: "right" }}>Harga</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div>Wristband - Member</div>
                <div>2 x Rp75.0000</div>
                <div>Diskon 10%</div>
              </td>
              <td style={{ textAlign: "right" }}>
                <div className="text-white">XX</div>
                <div>Rp150.000</div>
                <div>- Rp15.000</div>
              </td>
            </tr>
            <tr>
              <td>
                <div>Wristband</div>
                <div>1 x Rp75.0000</div>
              </td>
              <td style={{ textAlign: "right" }}>
                <div className="text-white">XX</div>
                <div>Rp75.000</div>
              </td>
            </tr>
            <tr>
              <td>
                <div>Registrasi Member Unlimited</div>
                <div>1 x Rp700.0000</div>
              </td>
              <td style={{ textAlign: "right" }}>
                <div className="text-white">XX</div>
                <div>Rp700.000</div>
              </td>
            </tr>
            <tr>
              <td>
                <div>Sesi 1/30 - Member OS099</div>
                <div>1 x Rp0</div>
              </td>
              <td style={{ textAlign: "right" }}>
                <div className="text-white">XX</div>
                <div>Rp0</div>
              </td>
            </tr>
            <tr>
              <td>
                <div>Sesi Ultah (Gratis) - Member OS099</div>
                <div>1 x Rp0</div>
              </td>
              <td style={{ textAlign: "right" }}>
                <div className="text-white">XX</div>
                <div>Rp0</div>
              </td>
            </tr>
            <tr>
              <td>
                <div>Kaus Kaki</div>
                <div>1 x Rp10.000</div>
              </td>
              <td style={{ textAlign: "right" }}>
                <div className="text-white">XX</div>
                <div>Rp10.000</div>
              </td>
            </tr>
          </tbody>
        </table>
        <hr />
        <div className="my-2">
          <div className="grid text-sm grid-cols-[2fr_5px_1fr] text-right">
            <strong>Total</strong>
            <strong>:</strong>
            <strong>Rp920.000</strong>
          </div>
          <div className="grid grid-cols-[2fr_5px_1fr] text-right">
            <div>Tunai</div>
            <div>:</div>
            <div>Rp1.000.000</div>
          </div>
          <div className="grid grid-cols-[2fr_5px_1fr] text-right">
            <div>Kembalian</div>
            <div>:</div>
            <div>Rp80.000</div>
          </div>
        </div>
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          Terima Kasih Atas Kunjungan Anda !
        </div>
      </div>
      <button onClick={generatePDF}>Download Receipt as PDF</button>
    </div>
  );
};

export default Receipt;
