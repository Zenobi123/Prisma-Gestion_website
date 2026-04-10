
import { Button } from "@/components/ui/button";
import ContactFieldGroup from "./contact/ContactFieldGroup";
import { useAdminContactTab } from "./contact/useAdminContactTab";

const ContactTab = () => {
  const { isLoading, contactData, handleChange, handleSave } = useAdminContactTab();

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-medium text-[#2E1A47]">Section 'Contact'</h3>
      <ContactFieldGroup contactData={contactData} isLoading={isLoading} handleChange={handleChange} />
      <div className="pt-4">
        <Button 
          onClick={handleSave} 
          className="bg-[#2E1A47] hover:bg-[#2E1A47]/90"
          disabled={isLoading}
        >
          {isLoading ? "Enregistrement..." : "Enregistrer les modifications"}
        </Button>
      </div>
    </div>
  );
};

export default ContactTab;
