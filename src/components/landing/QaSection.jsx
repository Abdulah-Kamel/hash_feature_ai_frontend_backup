import React from "react";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
const QaSection = () => {
  return (
    <div id="qa" className="w-full mt-24 scroll-mt-24">
      <div className="flex flex-col items-center justify-center gap-6 mb-12">
        <h3 className="text-4xl md:text-5xl font-bold text-white text-center">
          الأسئلة الشائعة
        </h3>
        <Accordion
          type="single"
          collapsible
          className="w-full max-w-6xl mx-auto"
          defaultValue="item-1"
          dir="rtl"
        >
          <AccordionItem
            value="item-1"
            className="bg-card border border-border/50 rounded-xl mb-4 px-6"
          >
            <AccordionTrigger className="text-white hover:no-underline text-right flex-row-reverse">
              <span className="text-lg font-semibold">
                هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-white/80 text-right leading-relaxed">
              هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد
              هذا النص من مولد النص العربي، حيث يمكنك أن تولد مثل هذا النص أو
              العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التي يولدها
              التطبيق. إذا كنت تحتاج إلى عدد أكبر من الفقرات يتيح لك مولد النص
              العربي زيادة عدد الفقرات كما تريد، النص لن يبدو مقسماً ولا يحوي
              أخطاء لغوية، مولد النص العربي مفيد لمصممي المواقع على وجه الخصوص،
              حيث يحتاج العميل في كثير من الأحيان أن يطلع على صورة حقيقية لتصميم
              الموقع.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-2"
            className="bg-card border border-border/50 rounded-xl mb-4 px-6"
          >
            <AccordionTrigger className="text-white hover:no-underline text-right flex-row-reverse">
              <span className="text-lg font-semibold">
                هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-white/80 text-right leading-relaxed">
              هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد
              هذا النص من مولد النص العربي، حيث يمكنك أن تولد مثل هذا النص أو
              العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التي يولدها
              التطبيق.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-3"
            className="bg-card border border-border/50 rounded-xl mb-4 px-6"
          >
            <AccordionTrigger className="text-white hover:no-underline text-right flex-row-reverse">
              <span className="text-lg font-semibold">
                هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-white/80 text-right leading-relaxed">
              هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد
              هذا النص من مولد النص العربي، حيث يمكنك أن تولد مثل هذا النص أو
              العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التي يولدها
              التطبيق.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-4"
            className="bg-card border border-border/50 rounded-xl mb-4 px-6"
          >
            <AccordionTrigger className="text-white hover:no-underline text-right flex-row-reverse">
              <span className="text-lg font-semibold">
                هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-white/80 text-right leading-relaxed">
              هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد
              هذا النص من مولد النص العربي، حيث يمكنك أن تولد مثل هذا النص أو
              العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التي يولدها
              التطبيق.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem
            value="item-5"
            className="bg-card border border-border/50 rounded-xl mb-4 px-6"
          >
            <AccordionTrigger className="text-white hover:no-underline text-right flex-row-reverse">
              <span className="text-lg font-semibold">
                هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة
              </span>
            </AccordionTrigger>
            <AccordionContent className="text-white/80 text-right leading-relaxed">
              هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، لقد تم توليد
              هذا النص من مولد النص العربي، حيث يمكنك أن تولد مثل هذا النص أو
              العديد من النصوص الأخرى إضافة إلى زيادة عدد الحروف التي يولدها
              التطبيق.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default QaSection;
