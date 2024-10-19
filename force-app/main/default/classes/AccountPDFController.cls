public class AccountPDFController {
    public Account account { get; set; }
    public String signatureUrl { get; set; }
    
    public AccountPDFController(ApexPages.StandardController controller) {
        this.account = (Account)controller.getRecord();
        signatureUrl = getSignatureUrl();
    }
    
    // Método para obtener la URL del Attachment (la firma en este caso)
    public String getSignatureUrl() {
        Attachment signature = [SELECT Id, Name, Body FROM Attachment 
                                WHERE ParentId = :account.Id 
                                AND Name LIKE '%.png'
                                LIMIT 1];
        
        if (signature != null) {
            return '/servlet/servlet.FileDownload?file=' + signature.Id;
        }
        return null;
    }
}
