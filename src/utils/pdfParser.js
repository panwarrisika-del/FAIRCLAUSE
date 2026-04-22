import * as pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc =
    new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url).href;

export const MAX_ANALYSIS_CHARS = 8000;

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

async function extractTextFromDocx(file) {
    try {
        const mammoth = await import('https://cdn.jsdelivr.net/npm/mammoth@1.8.0/mammoth.browser.min.js').catch(() => null);

        if (!mammoth) {
            return new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = e => {
                    const text = e.target.result;
                    if (text && text.trim().length > 50) resolve(text);
                    else reject(new Error('Could not read .docx file. Please paste the text instead.'));
                };
                reader.onerror = () => reject(new Error('Could not read .docx file. Please paste the text instead.'));
                reader.readAsText(file);
            });
        }

        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.default.extractRawText({ arrayBuffer });
        if (!result.value || result.value.trim().length < 50) {
            throw new Error('Document appears empty. Please paste the text instead.');
        }
        return result.value;
    } catch (e) {
        if (e.message.includes('paste') || e.message.includes('empty')) throw e;
        throw new Error('Could not read .docx file. Please paste the contract text instead.');
    }
}

export async function extractTextFromFile(file) {
    if (!file) throw new Error('No file provided.');

    if (file.type === 'application/pdf' || file.name?.toLowerCase().endsWith('.pdf'))
        return extractTextFromPDF(file);

    if (
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.name?.toLowerCase().endsWith('.docx')
    ) {
        return extractTextFromDocx(file);
    }

    if (file.type.startsWith('text/') || file.name?.match(/\.(txt|rtf)$/i)) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = e => resolve(e.target.result);
            reader.onerror = () => reject(new Error('Could not read file.'));
            reader.readAsText(file);
        });
    }

    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = e => resolve(e.target.result);
        reader.onerror = () => reject(new Error('Unsupported file type. Please paste the text instead.'));
        reader.readAsText(file);
    });
}