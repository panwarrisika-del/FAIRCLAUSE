import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc =

    'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';

export async function extractTextFromPDF(file) {

    const arrayBuffer = await file.arrayBuffer();

    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

    let fullText = '';

    for (let i = 1; i <= pdf.numPages; i++) {

        const page = await pdf.getPage(i);

        const content = await page.getTextContent();

        fullText += content.items.map(item => item.str).join(' ') + '\n';

    }

    return fullText;

}

export async function extractTextFromFile(file) {

    if (!file) throw new Error('No file provided.');

    if (file.type === 'application/pdf' || file.name?.endsWith('.pdf'))

        return extractTextFromPDF(file);

    return new Promise((resolve, reject) => {

        const reader = new FileReader();

        reader.onload = e => resolve(e.target.result);

        reader.onerror = () => reject(new Error('Could not read file.'));

        reader.readAsText(file);

    });

}
