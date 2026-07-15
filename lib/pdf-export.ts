import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { CalculationResult, CalculatorFormData } from "./types";
import { formatCurrency } from "./calculator";

export async function exportQuotationToPDF(
  formData: CalculatorFormData,
  calculationResult: CalculationResult
): Promise<void> {
  // Create a temporary HTML element with the quotation content
  const quotationHTML = createQuotationHTML(formData, calculationResult);

  // Create a temporary container
  const tempDiv = document.createElement("div");
  tempDiv.id = "pdf-quotation-export";
  tempDiv.innerHTML = quotationHTML;
  tempDiv.style.position = "absolute";
  tempDiv.style.left = "-9999px";
  tempDiv.style.width = "210mm"; // A4 width
  tempDiv.style.padding = "20mm";
  tempDiv.style.backgroundColor = "white";
  tempDiv.style.fontFamily = "system-ui, -apple-system, sans-serif";
  document.body.appendChild(tempDiv);

  try {
    // Convert HTML to canvas
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: "#ffffff",
      // html2canvas cannot parse Tailwind v4's oklch/lab colors on iOS Safari.
      // The quotation is fully styled inline, so removing application styles in
      // the cloned document is safe and keeps rendering limited to RGB/hex CSS.
      onclone: (clonedDocument) => {
        clonedDocument
          .querySelectorAll('style, link[rel="stylesheet"]')
          .forEach((node) => node.remove());

        const clonedQuotation = clonedDocument.getElementById(
          "pdf-quotation-export"
        );
        if (clonedQuotation instanceof HTMLElement) {
          clonedQuotation.style.position = "static";
          clonedQuotation.style.display = "block";
          clonedQuotation.style.backgroundColor = "#ffffff";
          clonedQuotation.style.color = "#000000";
        }

        clonedDocument.documentElement.style.backgroundColor = "#ffffff";
        clonedDocument.body.style.backgroundColor = "#ffffff";
      },
    });

    // Create PDF
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    });

    const imgWidth = 210; // A4 width in mm
    const pageHeight = 297; // A4 height in mm
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;

    let position = 0;

    // Add first page
    pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Add additional pages if needed
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    // Save PDF
    const date = new Date().toLocaleDateString("zh-HK");
    const fileName = `裝修報價單_${date.replace(/\//g, "-")}.pdf`;
    pdf.save(fileName);
  } finally {
    // Clean up
    document.body.removeChild(tempDiv);
  }
}

function createQuotationHTML(
  formData: CalculatorFormData,
  calculationResult: CalculationResult
): string {
  const date = new Date().toLocaleDateString("zh-HK", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return `
    <div style="font-family: 'PingFang TC', 'Microsoft YaHei', 'SimHei', sans-serif; color: #000;">
      <h1 style="text-align: center; font-size: 24px; margin-bottom: 20px; font-weight: bold;">
        裝修報價單
      </h1>
      
      <div style="margin-bottom: 20px;">
        <p style="font-size: 12px; color: #666;">日期: ${date}</p>
      </div>

      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 10px; border-bottom: 2px solid #000; padding-bottom: 5px;">
          物業資料
        </h2>
        <div style="font-size: 12px; line-height: 1.8;">
          <p><strong>物業類型:</strong> ${formData.propertyType}</p>
          <p><strong>實用面積:</strong> ${formData.squareFootage} 平方呎</p>
          <p><strong>房間配置:</strong> ${formData.roomConfig.bedrooms}房 ${formData.roomConfig.livingRooms}廳 ${formData.roomConfig.kitchens}廚 ${formData.roomConfig.bathrooms}廁</p>
          <p><strong>裝修範圍:</strong> ${formData.renovationScope}</p>
          <p><strong>材料級別:</strong> ${formData.materialQuality}</p>
          ${formData.specialRequirements.length > 0 ? `<p><strong>特殊要求:</strong> ${formData.specialRequirements.join(", ")}</p>` : ""}
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 10px; border-bottom: 2px solid #000; padding-bottom: 5px;">
          價格估算
        </h2>
        <div style="font-size: 12px; line-height: 1.8;">
          <p><strong>最低估算:</strong> ${formatCurrency(calculationResult.minEstimate)}</p>
          <p><strong>平均估算:</strong> ${formatCurrency(calculationResult.averageEstimate)}</p>
          <p><strong>最高估算:</strong> ${formatCurrency(calculationResult.maxEstimate)}</p>
        </div>
      </div>

      <div style="margin-bottom: 20px;">
        <h2 style="font-size: 18px; font-weight: bold; margin-bottom: 10px; border-bottom: 2px solid #000; padding-bottom: 5px;">
          詳細報價
        </h2>
        <table style="width: 100%; border-collapse: collapse; font-size: 11px;">
          <thead>
            <tr style="background-color: #f5f5f5; border-bottom: 2px solid #000;">
              <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">項目</th>
              <th style="text-align: left; padding: 8px; border: 1px solid #ddd;">說明</th>
              <th style="text-align: right; padding: 8px; border: 1px solid #ddd;">數量</th>
              <th style="text-align: right; padding: 8px; border: 1px solid #ddd;">單價</th>
              <th style="text-align: right; padding: 8px; border: 1px solid #ddd;">總計</th>
            </tr>
          </thead>
          <tbody>
            ${calculationResult.breakdown
              .map(
                (item) => `
              <tr style="border-bottom: 1px solid #ddd;">
                <td style="padding: 8px; border: 1px solid #ddd;">${item.item}</td>
                <td style="padding: 8px; border: 1px solid #ddd;">${item.description}</td>
                <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${item.quantity}</td>
                <td style="text-align: right; padding: 8px; border: 1px solid #ddd;">${formatCurrency(item.unitPrice)}</td>
                <td style="text-align: right; padding: 8px; border: 1px solid #ddd; font-weight: bold;">${formatCurrency(item.total)}</td>
              </tr>
            `
              )
              .join("")}
            <tr style="background-color: #f5f5f5; font-weight: bold;">
              <td colspan="4" style="text-align: right; padding: 8px; border: 1px solid #ddd;">總計</td>
              <td style="text-align: right; padding: 8px; border: 1px solid #ddd; font-size: 14px;">${formatCurrency(calculationResult.averageEstimate)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd;">
        <p style="font-size: 10px; color: #666; text-align: center; line-height: 1.6;">
          此報價單僅供參考，實際價格可能因現場情況而有所調整。<br>
          如有疑問，請聯絡我們查詢。
        </p>
      </div>
    </div>
  `;
}
