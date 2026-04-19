import * as pdfjsLib from 'pdfjs-dist';

// Use matching worker version to fix the version mismatch warning
pdfjsLib.GlobalWorkerOptions.workerSrc =
    new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).href;

export async function extractTextFromPDF(file) {
    try {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({
            data: arrayBuffer,
            useWorkerFetch: false,
            isEvalSupported: false,
        }).promise;

        let fullText = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            const pageText = content.items
                .map(item => item.str)
                .join(' ')
                .replace(/\s+/g, ' ');
            fullText += pageText + '\n\n';
        }

        if (!fullText.trim()) throw new Error('PDF appears to be scanned/image-based. Please paste the text instead.');
        return fullText;
    } catch (e) {
        if (e.message.includes('paste')) throw e;
        throw new Error('Could not read PDF. Try a different file or paste the text directly.');
    }
}

export async function extractTextFromFile(file) {
    if (!file) throw new Error('No file provided.');
    if (file.type === 'application/pdf' || file.name?.toLowerCase().endsWith('.pdf'))
        return extractTextFromPDF(file);
    if (file.type.startsWith('text/') || file.name?.match(/\.(txt|doc|rtf)$/i)) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Could not read file.'));
            reader.readAsText(file);
        });
    }
    // Try reading anything else as text anyway
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = () => reject(new Error('Unsupported file type. Please paste the text instead.'));
        reader.readAsText(file);
    });
}