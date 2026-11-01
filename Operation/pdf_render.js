import puppeteer from 'puppeteer';
import fs from 'fs';
import { readFile } from 'node:fs/promises';


async function readHTMLFile(fileName, fileLocation = './') {
  const filePath = fileLocation+fileName;
  try {
    
    const data = await readFile(filePath, 'utf8');
    return data;
  } catch (error) {
    console.error(`Error reading file ${filePath}:`, error);
    return '';
  }
}

async function renderPDF(outputFilename, htmlFormat, outputLocation = './') {
    console.log(htmlFormat);
    try{
        if (htmlFormat == ''){
            throw new Error('Empty HTML content in PDF Renderer');
        }
        if (outputFilename == ''){
            throw new Error('Empty PDF output filename in PDF Renderer');
        }
        // Launch a headless browser instance
        const browser = await puppeteer.launch({ headless: 'new' });
        const page = await browser.newPage();

        
        await page.setContent(htmlFormat, { waitUntil: 'networkidle0' });

        // Render to PDF
        const pdfBuffer = await page.pdf({
            format: 'A4',
            printBackground: true, // Ensures CSS background colors/images are rendered
            margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' }
        });

        // Save the file
        const outputFilePath = outputLocation + outputFilename;
        fs.writeFileSync(outputFilePath, pdfBuffer);

        await browser.close();
        console.log('PDF successfully generated!');
    } catch (error){
        console.error('Error generating pdf, check output: ', error);
    }
}

async function readPDFConfiguration(PDFConfigID){
    const data = await readFile('../Configuration/config/pdf_output_settings.json');
    const PDFConfigurations = JSON.parse(data).PDFConfigurations;
    let PDFConfiguration;
    if (typeof PDFConfigID === 'number'){        
        PDFConfiguration = PDFConfigurations.find(config => config.ID == PDFConfigID);

    } else if (typeof PDFConfigID === 'string'){
        PDFConfiguration = PDFConfigurations.find(config => config.name == PDFConfigID);


        
    } else {
        throw new Error(`PDFConfigID provided is not an acceptable type, please provide a number or string. Type given: ${typeof PDFConfigID}`);
       
    }
    if (!PDFConfiguration){
        throw new Error(`No PDFConfiguration found matching ID: ${PDFConfigID}`);
        return;
    } else{
        return PDFConfiguration
    }

}

async function generatePDF(){
    const PDFConfiguration = await readPDFConfiguration(0);
    console.log(PDFConfiguration);
    const htmlContent = await readFile(PDFConfiguration.HTMLFormatFile, 'utf-8');
    console.log(htmlContent);
    renderPDF(PDFConfiguration.fileNameFormat, htmlContent, PDFConfiguration.outputLocation);

}

generatePDF();