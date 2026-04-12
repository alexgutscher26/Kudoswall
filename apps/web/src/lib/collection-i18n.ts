/**
 * collection-i18n.ts
 *
 * Zero-dependency, client-side i18n for the Collection Wizard.
 * Reads `navigator.language` and resolves the best-matching locale
 * from the LOCALES dictionary. Falls back to English ("en").
 *
 * Supported: en | es | fr | de | pt | ja | zh | ar (RTL)
 */

"use client";

import { useState, useEffect } from "react";

// ─────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────

export interface CollectionStrings {
  // Progress bar
  step1of4: string;
  step2of4: string;
  step3of4: string;
  step4of4: string;
  complete: string;

  // Step titles
  titleRating: string;
  titleChoice: string;
  titleText: string;
  titleVideo: string;
  titleDetails: string;
  titleReview: string;
  titleSuccess: string;

  // Rating step
  ratingHeadline: string;
  ratingSubtext: string;
  verifiedUser: string;
  privacyGuaranteed: string;

  // Choice step
  choiceHeadline: string;
  choiceSubtext: string;
  choiceVideo: string;
  choiceVideoSub: string;
  choiceText: string;
  choiceTextSub: string;

  // Text step
  textPlaceholder: string;

  // Video step
  videoHeadline: string;
  videoSubtext: string;
  videoSkip: string;

  // Details step
  detailsPhoto: string;
  detailsPhotoOptional: string;
  detailsPhotoHint: string;
  detailsFullName: string;
  detailsEmail: string;
  detailsJobTitle: string;
  detailsCompany: string;
  detailsLinkedIn: string;
  identityVerification: string;
  identityVerificationSub: string;

  // Review step
  reviewHeadline: string;
  reviewSubtext: string;
  reviewLivePreview: string;
  reviewVerified: string;
  consentLabel: string;
  consentPrivacyLink: string;
  submitButton: string;
  submittingButton: string;
  editDetails: string;

  // Success step
  defaultThankYouHeadline: string;
  defaultThankYouBody: string;
  postAnotherReview: string;

  // Navigation
  nextStep: string;
  back: string;
  reviewTestimonial: string;

  // Footer
  footerDisclaimer: string;

  // Trust (text step sidebar)
  trustQuote: string;

  // RTL flag
  dir: "ltr" | "rtl";
}

// ─────────────────────────────────────────────
// Locales
// ─────────────────────────────────────────────

const en: CollectionStrings = {
  step1of4: "Step 1 of 4",
  step2of4: "Step 2 of 4",
  step3of4: "Step 3 of 4",
  step4of4: "Step 4 of 4",
  complete: "Complete",
  titleRating: "Overall Satisfaction",
  titleChoice: "Format Choice",
  titleText: "Detailed Feedback",
  titleVideo: "Record Video",
  titleDetails: "Identity & Photo",
  titleReview: "Final Review",
  titleSuccess: "Thank You",
  ratingHeadline: "How would you rate your experience?",
  ratingSubtext:
    "Your feedback helps us grow and provides authentic proof to others considering our services.",
  verifiedUser: "Verified User",
  privacyGuaranteed: "Privacy Guaranteed",
  choiceHeadline: "How would you like to share?",
  choiceSubtext: "Choose the format that works best for you.",
  choiceVideo: "Video",
  choiceVideoSub: "Quick & Personal",
  choiceText: "Text",
  choiceTextSub: "Simple & Classic",
  textPlaceholder: "It was an incredible experience because...",
  videoHeadline: "Record your video",
  videoSubtext: "What stood out the most? Sharing specific details helps others.",
  videoSkip: "Skip – write a text review instead",
  detailsPhoto: "Upload Profile Photo",
  detailsPhotoOptional: "(Optional)",
  detailsPhotoHint: "Recommended: 400×400px",
  detailsFullName: "Full Name",
  detailsEmail: "Email",
  detailsJobTitle: "Job Title",
  detailsCompany: "Company",
  detailsLinkedIn: "LinkedIn Profile",
  identityVerification: "Identity Verification",
  identityVerificationSub: "Your name and title are verified to build trust.",
  reviewHeadline: "Ready to submit?",
  reviewSubtext:
    "Everything looks great. Take one last look at how your testimonial will appear to others before you hit the button.",
  reviewLivePreview: "Live Preview",
  reviewVerified: "Verified",
  consentLabel: "I consent to my testimonial being stored and displayed publicly by {projectName}.",
  consentPrivacyLink: "Privacy Policy",
  submitButton: "Submit Testimonial",
  submittingButton: "Submitting...",
  editDetails: "Edit details",
  defaultThankYouHeadline: "You're awesome!",
  defaultThankYouBody:
    "Your feedback helps us grow and provides authentic proof to others considering our services.",
  postAnotherReview: "Post another review",
  nextStep: "Next Step",
  back: "Back",
  reviewTestimonial: "Review Testimonial",
  footerDisclaimer:
    "By continuing, you agree to our terms of service and acknowledge that your rating may be used for marketing purposes.",
  trustQuote:
    '"Real feedback like yours is what makes our community thrive. Thank you for your time."',
  dir: "ltr",
};

const es: CollectionStrings = {
  step1of4: "Paso 1 de 4",
  step2of4: "Paso 2 de 4",
  step3of4: "Paso 3 de 4",
  step4of4: "Paso 4 de 4",
  complete: "Completo",
  titleRating: "Satisfacción General",
  titleChoice: "Elige el Formato",
  titleText: "Comentario Detallado",
  titleVideo: "Grabar Video",
  titleDetails: "Identidad y Foto",
  titleReview: "Revisión Final",
  titleSuccess: "¡Gracias!",
  ratingHeadline: "¿Cómo calificarías tu experiencia?",
  ratingSubtext:
    "Tu opinión nos ayuda a crecer y brinda prueba auténtica a quienes consideran nuestros servicios.",
  verifiedUser: "Usuario Verificado",
  privacyGuaranteed: "Privacidad Garantizada",
  choiceHeadline: "¿Cómo quieres compartir?",
  choiceSubtext: "Elige el formato que mejor te funcione.",
  choiceVideo: "Video",
  choiceVideoSub: "Rápido y Personal",
  choiceText: "Texto",
  choiceTextSub: "Simple y Clásico",
  textPlaceholder: "Fue una experiencia increíble porque...",
  videoHeadline: "Graba tu video",
  videoSubtext: "¿Qué destacó más? Compartir detalles específicos ayuda a otros.",
  videoSkip: "Omitir – escribir una reseña de texto en su lugar",
  detailsPhoto: "Subir Foto de Perfil",
  detailsPhotoOptional: "(Opcional)",
  detailsPhotoHint: "Recomendado: 400×400px",
  detailsFullName: "Nombre Completo",
  detailsEmail: "Correo Electrónico",
  detailsJobTitle: "Cargo",
  detailsCompany: "Empresa",
  detailsLinkedIn: "Perfil de LinkedIn",
  identityVerification: "Verificación de Identidad",
  identityVerificationSub: "Tu nombre y cargo se verifican para generar confianza.",
  reviewHeadline: "¿Listo para enviar?",
  reviewSubtext:
    "Todo se ve bien. Echa un último vistazo a cómo aparecerá tu testimonio antes de enviarlo.",
  reviewLivePreview: "Vista Previa",
  reviewVerified: "Verificado",
  consentLabel:
    "Doy mi consentimiento para que mi testimonio sea almacenado y mostrado públicamente por {projectName}.",
  consentPrivacyLink: "Política de Privacidad",
  submitButton: "Enviar Testimonio",
  submittingButton: "Enviando...",
  editDetails: "Editar detalles",
  defaultThankYouHeadline: "¡Eres increíble!",
  defaultThankYouBody:
    "Tu opinión nos ayuda a crecer y brinda prueba auténtica a quienes consideran nuestros servicios.",
  postAnotherReview: "Publicar otra reseña",
  nextStep: "Siguiente Paso",
  back: "Atrás",
  reviewTestimonial: "Revisar Testimonio",
  footerDisclaimer:
    "Al continuar, aceptas nuestros términos de servicio y reconoces que tu calificación puede usarse con fines de marketing.",
  trustQuote:
    '"Opiniones reales como la tuya son las que hacen prosperar a nuestra comunidad. Gracias por tu tiempo."',
  dir: "ltr",
};

const fr: CollectionStrings = {
  step1of4: "Étape 1 sur 4",
  step2of4: "Étape 2 sur 4",
  step3of4: "Étape 3 sur 4",
  step4of4: "Étape 4 sur 4",
  complete: "Terminé",
  titleRating: "Satisfaction Générale",
  titleChoice: "Choisissez le Format",
  titleText: "Commentaire Détaillé",
  titleVideo: "Enregistrer une Vidéo",
  titleDetails: "Identité & Photo",
  titleReview: "Révision Finale",
  titleSuccess: "Merci !",
  ratingHeadline: "Comment évalueriez-vous votre expérience ?",
  ratingSubtext:
    "Vos retours nous aident à progresser et offrent une preuve authentique à ceux qui envisagent nos services.",
  verifiedUser: "Utilisateur Vérifié",
  privacyGuaranteed: "Confidentialité Garantie",
  choiceHeadline: "Comment souhaitez-vous partager ?",
  choiceSubtext: "Choisissez le format qui vous convient le mieux.",
  choiceVideo: "Vidéo",
  choiceVideoSub: "Rapide et Personnel",
  choiceText: "Texte",
  choiceTextSub: "Simple et Classique",
  textPlaceholder: "C'était une expérience incroyable parce que...",
  videoHeadline: "Enregistrez votre vidéo",
  videoSubtext: "Qu'est-ce qui vous a le plus marqué ? Les détails aident les autres.",
  videoSkip: "Passer – écrire un avis textuel à la place",
  detailsPhoto: "Télécharger une Photo de Profil",
  detailsPhotoOptional: "(Facultatif)",
  detailsPhotoHint: "Recommandé : 400×400px",
  detailsFullName: "Nom Complet",
  detailsEmail: "E-mail",
  detailsJobTitle: "Intitulé du Poste",
  detailsCompany: "Entreprise",
  detailsLinkedIn: "Profil LinkedIn",
  identityVerification: "Vérification d'Identité",
  identityVerificationSub: "Votre nom et titre sont vérifiés pour renforcer la confiance.",
  reviewHeadline: "Prêt à soumettre ?",
  reviewSubtext:
    "Tout semble parfait. Jetez un dernier coup d'œil à votre témoignage avant de l'envoyer.",
  reviewLivePreview: "Aperçu en Direct",
  reviewVerified: "Vérifié",
  consentLabel:
    "Je consens à ce que mon témoignage soit stocké et affiché publiquement par {projectName}.",
  consentPrivacyLink: "Politique de Confidentialité",
  submitButton: "Soumettre le Témoignage",
  submittingButton: "Envoi en cours...",
  editDetails: "Modifier les détails",
  defaultThankYouHeadline: "Vous êtes formidable !",
  defaultThankYouBody:
    "Vos retours nous aident à progresser et offrent une preuve authentique à ceux qui envisagent nos services.",
  postAnotherReview: "Publier un autre avis",
  nextStep: "Étape Suivante",
  back: "Retour",
  reviewTestimonial: "Réviser le Témoignage",
  footerDisclaimer:
    "En continuant, vous acceptez nos conditions d'utilisation et reconnaissez que votre évaluation peut être utilisée à des fins marketing.",
  trustQuote:
    '"Les vrais retours comme le vôtre sont ce qui fait prospérer notre communauté. Merci pour votre temps."',
  dir: "ltr",
};

const de: CollectionStrings = {
  step1of4: "Schritt 1 von 4",
  step2of4: "Schritt 2 von 4",
  step3of4: "Schritt 3 von 4",
  step4of4: "Schritt 4 von 4",
  complete: "Abgeschlossen",
  titleRating: "Gesamtzufriedenheit",
  titleChoice: "Format Wählen",
  titleText: "Detailliertes Feedback",
  titleVideo: "Video Aufnehmen",
  titleDetails: "Identität & Foto",
  titleReview: "Abschließende Überprüfung",
  titleSuccess: "Vielen Dank!",
  ratingHeadline: "Wie bewerten Sie Ihre Erfahrung?",
  ratingSubtext:
    "Ihr Feedback hilft uns zu wachsen und bietet anderen einen authentischen Einblick in unsere Leistungen.",
  verifiedUser: "Verifizierter Nutzer",
  privacyGuaranteed: "Datenschutz Garantiert",
  choiceHeadline: "Wie möchten Sie teilen?",
  choiceSubtext: "Wählen Sie das Format, das am besten für Sie geeignet ist.",
  choiceVideo: "Video",
  choiceVideoSub: "Schnell & Persönlich",
  choiceText: "Text",
  choiceTextSub: "Einfach & Klassisch",
  textPlaceholder: "Es war eine unglaubliche Erfahrung, weil...",
  videoHeadline: "Nehmen Sie Ihr Video auf",
  videoSubtext: "Was hat am meisten beeindruckt? Details helfen anderen.",
  videoSkip: "Überspringen – stattdessen eine Textbewertung schreiben",
  detailsPhoto: "Profilfoto Hochladen",
  detailsPhotoOptional: "(Optional)",
  detailsPhotoHint: "Empfohlen: 400×400px",
  detailsFullName: "Vollständiger Name",
  detailsEmail: "E-Mail",
  detailsJobTitle: "Berufsbezeichnung",
  detailsCompany: "Unternehmen",
  detailsLinkedIn: "LinkedIn-Profil",
  identityVerification: "Identitätsverifizierung",
  identityVerificationSub: "Ihr Name und Titel werden verifiziert, um Vertrauen aufzubauen.",
  reviewHeadline: "Bereit zum Absenden?",
  reviewSubtext:
    "Alles sieht gut aus. Werfen Sie einen letzten Blick auf Ihr Zeugnis, bevor Sie es absenden.",
  reviewLivePreview: "Live-Vorschau",
  reviewVerified: "Verifiziert",
  consentLabel:
    "Ich stimme zu, dass mein Zeugnis von {projectName} gespeichert und öffentlich angezeigt wird.",
  consentPrivacyLink: "Datenschutzrichtlinie",
  submitButton: "Zeugnis Einreichen",
  submittingButton: "Wird gesendet...",
  editDetails: "Details bearbeiten",
  defaultThankYouHeadline: "Sie sind großartig!",
  defaultThankYouBody:
    "Ihr Feedback hilft uns zu wachsen und bietet anderen einen authentischen Einblick in unsere Leistungen.",
  postAnotherReview: "Weitere Bewertung abgeben",
  nextStep: "Nächster Schritt",
  back: "Zurück",
  reviewTestimonial: "Zeugnis Überprüfen",
  footerDisclaimer:
    "Durch das Fortfahren stimmen Sie unseren Nutzungsbedingungen zu und erkennen an, dass Ihre Bewertung für Marketingzwecke verwendet werden kann.",
  trustQuote:
    '"Echtes Feedback wie Ihres ist es, was unsere Community gedeihen lässt. Vielen Dank für Ihre Zeit."',
  dir: "ltr",
};

const pt: CollectionStrings = {
  step1of4: "Passo 1 de 4",
  step2of4: "Passo 2 de 4",
  step3of4: "Passo 3 de 4",
  step4of4: "Passo 4 de 4",
  complete: "Concluído",
  titleRating: "Satisfação Geral",
  titleChoice: "Escolha o Formato",
  titleText: "Feedback Detalhado",
  titleVideo: "Gravar Vídeo",
  titleDetails: "Identidade & Foto",
  titleReview: "Revisão Final",
  titleSuccess: "Obrigado!",
  ratingHeadline: "Como você avaliaria sua experiência?",
  ratingSubtext:
    "Seu feedback nos ajuda a crescer e fornece prova autêntica para outros que consideram nossos serviços.",
  verifiedUser: "Utilizador Verificado",
  privacyGuaranteed: "Privacidade Garantida",
  choiceHeadline: "Como você gostaria de compartilhar?",
  choiceSubtext: "Escolha o formato que funciona melhor para você.",
  choiceVideo: "Vídeo",
  choiceVideoSub: "Rápido e Pessoal",
  choiceText: "Texto",
  choiceTextSub: "Simples e Clássico",
  textPlaceholder: "Foi uma experiência incrível porque...",
  videoHeadline: "Grave seu vídeo",
  videoSubtext: "O que mais se destacou? Compartilhar detalhes específicos ajuda outros.",
  videoSkip: "Pular – escrever uma avaliação de texto",
  detailsPhoto: "Carregar Foto de Perfil",
  detailsPhotoOptional: "(Opcional)",
  detailsPhotoHint: "Recomendado: 400×400px",
  detailsFullName: "Nome Completo",
  detailsEmail: "E-mail",
  detailsJobTitle: "Cargo",
  detailsCompany: "Empresa",
  detailsLinkedIn: "Perfil do LinkedIn",
  identityVerification: "Verificação de Identidade",
  identityVerificationSub: "Seu nome e título são verificados para construir confiança.",
  reviewHeadline: "Pronto para enviar?",
  reviewSubtext:
    "Tudo parece ótimo. Dê uma última olhada no seu depoimento antes de clicar no botão.",
  reviewLivePreview: "Pré-visualização ao Vivo",
  reviewVerified: "Verificado",
  consentLabel:
    "Consinto que o meu depoimento seja armazenado e exibido publicamente por {projectName}.",
  consentPrivacyLink: "Política de Privacidade",
  submitButton: "Enviar Depoimento",
  submittingButton: "A enviar...",
  editDetails: "Editar detalhes",
  defaultThankYouHeadline: "Você é incrível!",
  defaultThankYouBody:
    "Seu feedback nos ajuda a crescer e fornece prova autêntica para outros que consideram nossos serviços.",
  postAnotherReview: "Publicar outra avaliação",
  nextStep: "Próximo Passo",
  back: "Voltar",
  reviewTestimonial: "Rever Depoimento",
  footerDisclaimer:
    "Ao continuar, você concorda com nossos termos de serviço e reconhece que sua avaliação pode ser usada para fins de marketing.",
  trustQuote:
    '"Feedback real como o seu é o que faz a nossa comunidade prosperar. Obrigado pelo seu tempo."',
  dir: "ltr",
};

const ja: CollectionStrings = {
  step1of4: "ステップ 1/4",
  step2of4: "ステップ 2/4",
  step3of4: "ステップ 3/4",
  step4of4: "ステップ 4/4",
  complete: "完了",
  titleRating: "総合満足度",
  titleChoice: "形式を選択",
  titleText: "詳細なフィードバック",
  titleVideo: "動画を録画",
  titleDetails: "本人確認 & 写真",
  titleReview: "最終確認",
  titleSuccess: "ありがとうございます！",
  ratingHeadline: "ご利用体験を評価してください",
  ratingSubtext:
    "あなたのフィードバックは私たちの成長を助け、サービスを検討している他の方々に本物の証拠を提供します。",
  verifiedUser: "確認済みユーザー",
  privacyGuaranteed: "プライバシー保護",
  choiceHeadline: "どのように共有しますか？",
  choiceSubtext: "最適な形式をお選びください。",
  choiceVideo: "動画",
  choiceVideoSub: "手軽でパーソナル",
  choiceText: "テキスト",
  choiceTextSub: "シンプルでオーソドックス",
  textPlaceholder: "素晴らしい体験でした。なぜなら...",
  videoHeadline: "動画を録画してください",
  videoSubtext: "最も印象的だったことは？具体的な詳細を共有することで他の方の参考になります。",
  videoSkip: "スキップ – テキストレビューを書く",
  detailsPhoto: "プロフィール写真をアップロード",
  detailsPhotoOptional: "（任意）",
  detailsPhotoHint: "推奨: 400×400px",
  detailsFullName: "氏名",
  detailsEmail: "メールアドレス",
  detailsJobTitle: "役職",
  detailsCompany: "会社名",
  detailsLinkedIn: "LinkedInプロフィール",
  identityVerification: "本人確認",
  identityVerificationSub: "お名前と役職は信頼構築のために確認されます。",
  reviewHeadline: "送信する準備はできましたか？",
  reviewSubtext:
    "すべて問題ありません。ボタンをクリックする前に、あなたの推薦文がどのように表示されるかを最後に確認してください。",
  reviewLivePreview: "ライブプレビュー",
  reviewVerified: "確認済み",
  consentLabel: "{projectName} による推薦文の保存と公開表示に同意します。",
  consentPrivacyLink: "プライバシーポリシー",
  submitButton: "推薦文を送信",
  submittingButton: "送信中...",
  editDetails: "詳細を編集",
  defaultThankYouHeadline: "ありがとうございます！",
  defaultThankYouBody:
    "あなたのフィードバックは私たちの成長を助け、サービスを検討している他の方々に本物の証拠を提供します。",
  postAnotherReview: "別のレビューを投稿",
  nextStep: "次のステップ",
  back: "戻る",
  reviewTestimonial: "推薦文を確認",
  footerDisclaimer:
    "続行することで、利用規約に同意し、評価がマーケティング目的に使用される場合があることを認めます。",
  trustQuote:
    '"あなたのような本物のフィードバックこそが、私たちのコミュニティを豊かにします。ありがとうございました。"',
  dir: "ltr",
};

const zh: CollectionStrings = {
  step1of4: "第 1 步，共 4 步",
  step2of4: "第 2 步，共 4 步",
  step3of4: "第 3 步，共 4 步",
  step4of4: "第 4 步，共 4 步",
  complete: "已完成",
  titleRating: "整体满意度",
  titleChoice: "选择格式",
  titleText: "详细反馈",
  titleVideo: "录制视频",
  titleDetails: "身份 & 照片",
  titleReview: "最终审核",
  titleSuccess: "感谢您！",
  ratingHeadline: "您如何评价您的体验？",
  ratingSubtext: "您的反馈帮助我们成长，并为考虑我们服务的其他人提供真实证明。",
  verifiedUser: "已验证用户",
  privacyGuaranteed: "隐私保护",
  choiceHeadline: "您希望如何分享？",
  choiceSubtext: "选择最适合您的格式。",
  choiceVideo: "视频",
  choiceVideoSub: "快速且个人化",
  choiceText: "文字",
  choiceTextSub: "简单且经典",
  textPlaceholder: "这是一次令人难忘的体验，因为...",
  videoHeadline: "录制您的视频",
  videoSubtext: "最令您印象深刻的是什么？分享具体细节可以帮助其他人。",
  videoSkip: "跳过 – 改写文字评价",
  detailsPhoto: "上传个人照片",
  detailsPhotoOptional: "（可选）",
  detailsPhotoHint: "推荐：400×400px",
  detailsFullName: "全名",
  detailsEmail: "电子邮件",
  detailsJobTitle: "职位",
  detailsCompany: "公司",
  detailsLinkedIn: "LinkedIn 个人资料",
  identityVerification: "身份验证",
  identityVerificationSub: "您的姓名和职位已验证，以建立信任。",
  reviewHeadline: "准备好提交了吗？",
  reviewSubtext: "一切看起来都很好。在点击按钮之前，最后看一眼您的推荐将如何呈现给他人。",
  reviewLivePreview: "实时预览",
  reviewVerified: "已验证",
  consentLabel: "我同意 {projectName} 存储并公开展示我的推荐。",
  consentPrivacyLink: "隐私政策",
  submitButton: "提交推荐",
  submittingButton: "提交中...",
  editDetails: "编辑详情",
  defaultThankYouHeadline: "您真棒！",
  defaultThankYouBody: "您的反馈帮助我们成长，并为考虑我们服务的其他人提供真实证明。",
  postAnotherReview: "发布另一条评价",
  nextStep: "下一步",
  back: "返回",
  reviewTestimonial: "审核推荐",
  footerDisclaimer: "继续即表示您同意我们的服务条款，并承认您的评分可能用于营销目的。",
  trustQuote: '"像您这样真实的反馈，正是让我们社区蓬勃发展的动力。感谢您的时间。"',
  dir: "ltr",
};

const ar: CollectionStrings = {
  step1of4: "الخطوة 1 من 4",
  step2of4: "الخطوة 2 من 4",
  step3of4: "الخطوة 3 من 4",
  step4of4: "الخطوة 4 من 4",
  complete: "مكتمل",
  titleRating: "الرضا العام",
  titleChoice: "اختر التنسيق",
  titleText: "التغذية الراجعة التفصيلية",
  titleVideo: "تسجيل فيديو",
  titleDetails: "الهوية والصورة",
  titleReview: "المراجعة النهائية",
  titleSuccess: "شكراً لك!",
  ratingHeadline: "كيف تُقيّم تجربتك؟",
  ratingSubtext: "تساعدنا ملاحظاتك على النمو وتوفر دليلاً حقيقياً للآخرين الذين يفكرون في خدماتنا.",
  verifiedUser: "مستخدم موثق",
  privacyGuaranteed: "الخصوصية مضمونة",
  choiceHeadline: "كيف تريد المشاركة؟",
  choiceSubtext: "اختر التنسيق الأنسب لك.",
  choiceVideo: "فيديو",
  choiceVideoSub: "سريع وشخصي",
  choiceText: "نص",
  choiceTextSub: "بسيط وكلاسيكي",
  textPlaceholder: "كانت تجربة رائعة لأن...",
  videoHeadline: "سجّل الفيديو الخاص بك",
  videoSubtext: "ما الذي تميّز أكثر؟ مشاركة التفاصيل تساعد الآخرين.",
  videoSkip: "تخطي – كتابة مراجعة نصية بدلاً من ذلك",
  detailsPhoto: "رفع صورة الملف الشخصي",
  detailsPhotoOptional: "(اختياري)",
  detailsPhotoHint: "الموصى به: 400×400 بكسل",
  detailsFullName: "الاسم الكامل",
  detailsEmail: "البريد الإلكتروني",
  detailsJobTitle: "المسمى الوظيفي",
  detailsCompany: "الشركة",
  detailsLinkedIn: "ملف LinkedIn",
  identityVerification: "التحقق من الهوية",
  identityVerificationSub: "يتم التحقق من اسمك ومسمّاك الوظيفي لبناء الثقة.",
  reviewHeadline: "هل أنت مستعد للإرسال؟",
  reviewSubtext:
    "يبدو كل شيء رائعاً. ألقِ نظرة أخيرة على كيفية ظهور شهادتك للآخرين قبل الضغط على الزر.",
  reviewLivePreview: "معاينة مباشرة",
  reviewVerified: "موثّق",
  consentLabel: "أوافق على تخزين شهادتي وعرضها علناً بواسطة {projectName}.",
  consentPrivacyLink: "سياسة الخصوصية",
  submitButton: "إرسال الشهادة",
  submittingButton: "جارٍ الإرسال...",
  editDetails: "تعديل التفاصيل",
  defaultThankYouHeadline: "أنت رائع!",
  defaultThankYouBody:
    "تساعدنا ملاحظاتك على النمو وتوفر دليلاً حقيقياً للآخرين الذين يفكرون في خدماتنا.",
  postAnotherReview: "نشر مراجعة أخرى",
  nextStep: "الخطوة التالية",
  back: "رجوع",
  reviewTestimonial: "مراجعة الشهادة",
  footerDisclaimer:
    "بالمتابعة، فإنك توافق على شروط الخدمة وتُقرّ بأن تقييمك قد يُستخدم لأغراض تسويقية.",
  trustQuote: '"التغذية الراجعة الحقيقية مثل تغذيتك هي ما يجعل مجتمعنا يزدهر. شكراً لك على وقتك."',
  dir: "rtl",
};

// ─────────────────────────────────────────────
// Locale Map  (language-tag → dictionary)
// ─────────────────────────────────────────────

const LOCALES: Record<string, CollectionStrings> = {
  en,
  es,
  fr,
  de,
  pt,
  ja,
  zh,
  ar,
};

/**
 * Resolve the best-match locale dictionary for a given BCP-47 tag.
 *
 * Matching strategy (most → least specific):
 *   1. Exact match:       "pt-BR" → "pt-BR" (not in map)
 *   2. Language prefix:   "pt-BR" → "pt"    ✓
 *   3. Fallback:                   → "en"
 */
function resolveLocale(tag: string): CollectionStrings {
  if (LOCALES[tag]) return LOCALES[tag];
  const lang = tag.split("-")[0];
  if (lang && LOCALES[lang]) return LOCALES[lang];
  return en;
}

// ─────────────────────────────────────────────
// Hook
// ─────────────────────────────────────────────

/**
 * useLocale()
 *
 * Reads `navigator.language` on the client and returns:
 *   - `t`   — the resolved CollectionStrings dictionary
 *   - `dir` — "ltr" | "rtl" for the resolved locale
 */
export function useLocale(): { t: CollectionStrings; dir: "ltr" | "rtl" } {
  const [locale, setLocale] = useState<CollectionStrings>(en);

  useEffect(() => {
    const tag = navigator.language ?? "en";
    setLocale(resolveLocale(tag));
  }, []);

  return { t: locale, dir: locale.dir };
}
