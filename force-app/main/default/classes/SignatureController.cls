public with sharing class SignatureController {
    @AuraEnabled
    public static void saveSignatureAttachment(Id recordId, String signatureData) {
        try {
            String base64Image = signatureData.split(',')[1]; 
            Blob signatureBlob = EncodingUtil.base64Decode(base64Image);
            
            Attachment attachment = new Attachment();
            attachment.ParentId = recordId;
            attachment.Name = 'Firma.png';
            attachment.Body = signatureBlob;
            attachment.ContentType = 'image/png';
            insert attachment;
        } catch (Exception e) {
            throw new AuraHandledException('Error al guardar la firma: ' + e.getMessage());
        }
    }
}
