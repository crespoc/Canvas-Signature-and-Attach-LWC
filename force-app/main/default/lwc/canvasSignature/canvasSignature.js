import { LightningElement, api } from 'lwc';
import saveSignatureAttachment from '@salesforce/apex/SignatureController.saveSignatureAttachment';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

export default class CanvasSignature extends LightningElement {
    canvas;
    ctx;
    isDrawing = false;
    signatureDataUrl;

    @api recordId; 

    renderedCallback() {
        if (!this.canvas) {
            this.canvas = this.template.querySelector('canvas');
            this.ctx = this.canvas.getContext('2d');

            this.canvas.addEventListener('mousedown', this.startDrawing.bind(this));
            this.canvas.addEventListener('mousemove', this.draw.bind(this));
            this.canvas.addEventListener('mouseup', this.stopDrawing.bind(this));
            this.canvas.addEventListener('mouseout', this.stopDrawing.bind(this));
        }
    }

    startDrawing(event) {
        this.isDrawing = true;
        this.ctx.beginPath();
        this.ctx.moveTo(event.offsetX, event.offsetY);
    }

    draw(event) {
        if (!this.isDrawing) return;
        this.ctx.lineTo(event.offsetX, event.offsetY);
        this.ctx.stroke();
    }

    stopDrawing() {
        this.isDrawing = false;
    }

    clearSignature() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    saveSignature() {
        // Convertir canvas a base64
        this.signatureDataUrl = this.canvas.toDataURL('image/png');
        
        // llamar al metodo
        saveSignatureAttachment({ 
            recordId: this.recordId, 
            signatureData: this.signatureDataUrl 
        })
        .then(() => {
            // mostrar el mensaje de firma guardada
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Éxito',
                    message: 'Firma guardada como adjunto.',
                    variant: 'success',
                })
            );
            this.clearSignature(); // limpiar el canvas despues de guardar
        })
        .catch(error => {
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error al guardar firma',
                    message: error.body.message,
                    variant: 'error',
                })
            );
        });
    }
}
