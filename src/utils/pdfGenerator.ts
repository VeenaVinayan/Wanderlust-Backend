import PDFDocument from 'pdfkit';
import fs from 'fs';
import { TPackage } from '../Types/Package.types';

const generateItineraryPDF = (packageData : TPackage, outputPath: string) =>{
      const doc = new PDFDocument({ margin:50 });
      doc.pipe(fs.createWriteStream(outputPath));
      doc.fontSize(20).text(`Itinerary - ${packageData.name}`, {
            align: 'center',
            underline: true,
      });
      doc.moveDown(2);
      doc.fontSize(16).text(`Package Name: ${packageData.name}`, {
                align: 'left',
                underline: true,
        }); 
        doc.moveDown(1);    
        doc.fontSize(14).text(`Description: ${packageData.description}`, {
                align: 'left',
        });
        doc.moveDown(1);    
        doc.fontSize(14).text(`Duration: ${packageData.day} Days - ${packageData.night} Night`, {
                align: 'left',
        });
        doc.moveDown(1);    
        doc.fontSize(14).text(`Price: ${packageData.price}`, {
                align: 'left',
        });
        doc.moveDown(2);
        doc.fontSize(16).text('Itinerary Details', {
                align: 'left',
                underline: true,
        });
        doc.moveDown(1);    
        packageData.itinerary.forEach((item, index) => {
                doc.fontSize(14).text(`Day ${index + 1}:`, {
                        align: 'left',
                        underline: true,
                });
                doc.moveDown(1);
                doc.fontSize(12).text(`Description: ${item.description}`, {
                        align: 'left',
                });
                doc.moveDown(1);
                doc.fontSize(12).text(`Activities: ${item.activities}`, {
                        align: 'left',
                });
                doc.moveDown(1);
                doc.fontSize(12).text(`Meals: ${item.meals.join(', ')}`, {
                        align: 'left',
                });
                doc.moveDown(1);
                doc.fontSize(12).text(`Stay: ${item.stay}`, {
                        align: 'left',
                });
                doc.moveDown(1);
                doc.fontSize(12).text(`Transfer: ${item.transfer}`, {
                        align: 'left',
                });
                doc.moveDown(2);
        });
    doc.end();
}

export default generateItineraryPDF;
