# AL-ARYAM — Site Content (Arabic + English)

> **Use this copy verbatim** in `src/locales/ar.json` and `src/locales/en.json`. Do not add claims, numbers, clients, or contact details that are not here.
> If a layout needs a string that is missing, write `TODO-COPY` and list it in your summary — do not invent it.

---

## Global

| Key | Arabic | English |
|---|---|---|
| company.name | شركة الأريام | AL-ARYAM |
| company.fullName | شركة الأريام لتقنية المعلومات | AL-ARYAM Information Technology |
| company.tagline | الشريك التقني الآمن | Your Secure Technical Partner |
| company.email | Info@Alaryam.ly | Info@Alaryam.ly |
| nav.home | الرئيسية | Home |
| nav.services | خدماتنا | Services |
| nav.about | من نحن | About |
| nav.contact | تواصل معنا | Contact |
| nav.langSwitch | English | العربية |
| cta.contact | تواصل معنا | Get in touch |
| cta.services | استكشف خدماتنا | Explore our services |
| cta.learnMore | اعرف المزيد | Learn more |
| footer.rights | جميع الحقوق محفوظة © {year} شركة الأريام | © {year} AL-ARYAM. All rights reserved. |
| footer.blurb | حلول تقنية وهندسية متكاملة للمؤسسات والشركات والجهات الحكومية. | Integrated technical and engineering solutions for organizations, businesses, and government entities. |

---

## Home

### Hero
- **eyebrow** — AR: الشريك التقني الآمن · EN: Your Secure Technical Partner
- **title** — AR: الابتكار، الأمان، الحلول المتكاملة. · EN: Innovation, security, integrated solutions.
- **lead** — AR: توفّر شركة الأريام حلولًا تقنية وهندسية متطورة تجمع بين الخبرة والجودة. نعمل على بناء مستقبل رقمي مستدام عبر البرمجة وأنظمة المعلومات والشبكات، للحفاظ على سلامة بيانات المؤسسات وتعزيز كفاءة أعمالها.
  EN: AL-ARYAM delivers advanced technical and engineering solutions that combine expertise with quality. Through software, information systems, and networks, we help build a sustainable digital future — keeping organizations' data safe and their operations efficient.
- **buttons** — cta.contact (primary) · cta.services (secondary)

### Services section
- **title** — AR: شغفنا تقديم الحلول المتكاملة · EN: Passionate about integrated solutions
- **lead** — AR: باقة متنوعة من الخدمات التقنية والهندسية تلبّي احتياجات عملائنا، من المؤسسات والشركات إلى الجهات الحكومية، لنمنحهم مستقبلًا أكثر أمانًا وابتكارًا.
  EN: A diverse range of technical and engineering services built around our clients' needs — from organizations and businesses to government entities — for a safer, more innovative future.
- Cards: the six services below (title + short), each linking to its service page.

### How we work
- **title** — AR: كيف نعمل · EN: How we work
- **lead** — AR: منهجية واضحة من أول لقاء حتى ما بعد التشغيل. · EN: A clear path from the first conversation to long after launch.

| # | Arabic title | Arabic text | English title | English text |
|---|---|---|---|---|
| 1 | فهم الاحتياج | نستمع لأهدافك وندرس بيئة عملك وأنظمتك الحالية. | Understand | We listen to your goals and study your environment and existing systems. |
| 2 | التصميم | نضع حلًّا متكاملًا ومخططًا واضحًا للتنفيذ. | Design | We shape an integrated solution and a clear implementation plan. |
| 3 | التنفيذ | ننفّذ ونركّب ونختبر وفق أعلى معايير الجودة. | Build | We implement, install, and test to the highest quality standards. |
| 4 | التشغيل والدعم | نسلّم ونُدرّب ونبقى إلى جانبك بدعم فني مستمر. | Operate & support | We hand over, train your team, and stay by your side with ongoing support. |

### Who we serve
- **title** — AR: من نخدم · EN: Who we serve

| Arabic | English |
|---|---|
| **المؤسسات** — أنظمة وشبكات تحمي بياناتها وتدعم استمرارية عملها. | **Organizations** — systems and networks that protect data and keep operations running. |
| **الشركات** — تطبيقات وحلول ذكية ترفع كفاءة الأعمال. | **Businesses** — applications and smart solutions that raise efficiency. |
| **الجهات الحكومية** — حلول آمنة ومتكاملة من التصميم حتى التشغيل. | **Government entities** — secure, integrated solutions from design to operation. |

### Why AL-ARYAM
- **title** — AR: لماذا الأريام · EN: Why AL-ARYAM

| Arabic | English |
|---|---|
| **الأمان أولًا** — نصمّم كل حل ليحافظ على سلامة بياناتك. | **Security first** — every solution is designed to keep your data safe. |
| **حلول متكاملة** — برمجة وشبكات وأنظمة أمنية تحت سقف واحد. | **Integrated solutions** — software, networks, and security systems under one roof. |
| **دعم مستمر** — نبقى معك بعد التسليم لضمان استمرار عمل أنظمتك بكفاءة. | **Ongoing support** — we stay with you after delivery so your systems keep running efficiently. |
| **جودة في التنفيذ** — نعمل وفق أعلى معايير الجودة في كل مرحلة. | **Quality delivery** — the highest quality standards at every stage. |

### Closing CTA band
- **title** — AR: لدينا فريق جاهز لتلبية احتياجاتك التقنية والاستشارية. · EN: Our team is ready for your technical and consulting needs.
- **lead** — AR: نسهر على دعم عملك المهم، ونحافظ على أهم بياناتك من أجل استمرارك. · EN: We stand behind your critical work and protect your most important data, so your business keeps moving.
- **button** — cta.contact

---

## Services (slugs are fixed)

Each service has: `title`, `short` (card text), `intro` (page lead), `items` (bullet list).

### 1. `software-development`
- **title** — AR: حلول البرمجة والتطوير · EN: Software Development
- **short** — AR: تصميم وتطوير تطبيقات الويب والأنظمة البرمجية والتطبيقات، مع دعم فني متخصص. · EN: Design and development of web applications, software systems, and apps — with specialist support.
- **intro** — AR: نبني أنظمة وتطبيقات مصمّمة حول طريقة عمل مؤسستك، من الفكرة حتى التشغيل والصيانة. · EN: We build systems and applications shaped around how your organization works — from idea to launch and maintenance.
- **items**
  - AR: تطوير وصيانة تطبيقات الويب · EN: Web application development and maintenance
  - AR: تطوير تطبيقات الهواتف الذكية · EN: Mobile app development
  - AR: تصميم وتطوير الأنظمة الإدارية الخاصة بالشركات والمؤسسات · EN: Custom management systems for businesses and organizations
  - AR: خدمات برمجية متكاملة مع دعم فني متخصص · EN: End-to-end software services with specialist support

### 2. `technical-support`
- **title** — AR: الدعم الفني المستمر · EN: Ongoing Technical Support
- **short** — AR: خدمة دعم فني متاحة لضمان استمرار عمل أنظمتك بكفاءة عالية. · EN: Technical support that keeps your systems running at full efficiency.
- **intro** — AR: نبقى إلى جانبك بعد التسليم، لأن استمرارية عملك هي الأهم. · EN: We stay by your side after delivery — because your continuity matters most.
- **items**
  - AR: دعم فني متخصص للأنظمة والتطبيقات · EN: Specialist support for systems and applications
  - AR: خدمات استشارية تقنية · EN: Technical consulting services
  - AR: دعم فني داخلي لضمان استمرارية العمل · EN: On-site support to ensure business continuity
  - AR: صيانة دورية ومتابعة أداء الأنظمة · EN: Routine maintenance and system performance monitoring

### 3. `security-surveillance`
- **title** — AR: الأنظمة الأمنية والمراقبة · EN: Security & Surveillance Systems
- **short** — AR: كاميرات مراقبة، وأنظمة إنذار مبكر، وحلول دخول وخروج ذكية. · EN: CCTV, early-warning alarm systems, and smart access control.
- **intro** — AR: حلول أمنية تحمي منشآتك وتمنحك رؤية واضحة وتحكمًا كاملًا. · EN: Security solutions that protect your facilities and give you clear visibility and full control.
- **items**
  - AR: تركيب وصيانة منظومات المراقبة بالكاميرات · EN: CCTV installation and maintenance
  - AR: أجهزة الإنذار وأنظمة الإنذار المبكر · EN: Alarms and early-warning systems
  - AR: حلول الدخول والخروج الذكية · EN: Smart access control
  - AR: أنظمة المراقبة للمنشآت · EN: Facility monitoring systems

### 4. `networks-infrastructure`
- **title** — AR: البنية التحتية والشبكات · EN: Networks & Infrastructure
- **short** — AR: تركيب وصيانة شبكات الحاسوب والاتصالات، السلكية واللاسلكية. · EN: Installation and maintenance of wired and wireless computer and telecom networks.
- **intro** — AR: بنية تحتية موثوقة وآمنة هي الأساس الذي تقوم عليه كل أنظمتك. · EN: Reliable, secure infrastructure is the foundation every system stands on.
- **items**
  - AR: تركيب وصيانة شبكات الحاسوب السلكية واللاسلكية · EN: Wired and wireless computer network installation and maintenance
  - AR: شبكات الاتصالات · EN: Telecommunication networks
  - AR: تصميم وتنفيذ شبكات وأنظمة تقنية معلومات آمنة · EN: Design and implementation of secure networks and IT systems

### 5. `project-management`
- **title** — AR: إدارة المشاريع والتكامل · EN: Project Management & Integration
- **short** — AR: تنفيذ متكامل للمشاريع من التصميم حتى التشغيل، وفق أعلى معايير الجودة. · EN: End-to-end project delivery from design to operation, to the highest quality standards.
- **intro** — AR: جهة واحدة تتولّى مشروعك كاملًا وتربط أنظمته ببعضها. · EN: One partner that owns your whole project and connects its systems together.
- **items**
  - AR: تنفيذ المشاريع من التصميم حتى التشغيل · EN: Delivery from design through operation
  - AR: تكامل الأنظمة التقنية والهندسية · EN: Integration of technical and engineering systems
  - AR: الالتزام بأعلى معايير الجودة · EN: Adherence to the highest quality standards

### 6. `iot`
- **title** — AR: إنترنت الأشياء · EN: Internet of Things
- **short** — AR: نصمّم وننفّذ أنظمة ذكية جاهزة للمستقبل. · EN: We design and build future-ready smart systems.
- **intro** — AR: ندمج تقنية إنترنت الأشياء (IoT) لإنشاء حلول آلية تعمل بالبيانات من أجل التطوّر الحضري. · EN: We integrate Internet of Things (IoT) technology to create automated, data-driven solutions for urban development.
- **items**
  - AR: تصميم وتنفيذ الأنظمة الذكية · EN: Smart system design and implementation
  - AR: حلول آلية تعمل بالبيانات · EN: Automated, data-driven solutions
  - AR: حلول للتطوّر الحضري · EN: Solutions for urban development

### Service page shared strings
| Key | Arabic | English |
|---|---|---|
| service.whatWeOffer | ما نقدّمه | What we offer |
| service.otherServices | خدمات أخرى | Other services |
| service.ctaTitle | هل تحتاج هذه الخدمة؟ | Need this service? |
| service.ctaLead | راسلنا وسنعود إليك لمناقشة احتياجك. | Write to us and we'll get back to you to discuss your needs. |
| services.pageTitle | خدماتنا | Our Services |
| services.pageLead | = Home services lead | = Home services lead |

---

## About
- **pageTitle** — AR: من نحن · EN: About us
- **intro** — AR: شركة الأريام شركة ليبية تقدّم خدمات احترافية تغطي مجموعة واسعة من الاحتياجات التقنية والهندسية، لدعم الشركات والمؤسسات بأحدث الحلول المبتكرة والموثوقة. EN: AL-ARYAM is a Libyan company providing professional services across a wide range of technical and engineering needs, supporting businesses and organizations with innovative, reliable solutions.
- **vision** — AR: **رؤيتنا** — أن نكون الشريك التقني الآمن الذي تعتمد عليه المؤسسات في بناء مستقبلها الرقمي. · EN: **Our vision** — to be the secure technical partner organizations rely on to build their digital future.
- **mission** — AR: **رسالتنا** — تقديم حلول تقنية وهندسية متكاملة تحافظ على سلامة البيانات وتعزّز كفاءة الأعمال واستمراريتها. · EN: **Our mission** — to deliver integrated technical and engineering solutions that protect data and strengthen business efficiency and continuity.
- **values** (title AR: قيمنا · EN: Our values) — reuse the four "Why AL-ARYAM" items.
- **capabilities** (two blocks)
  - AR: **الحلول التقنية المتكاملة** — تطوير وصيانة تطبيقات الويب والهواتف الذكية · تصميم وتنفيذ شبكات وأنظمة تقنية معلومات آمنة · الدعم الفني والخدمات الاستشارية المتخصصة.
    EN: **Integrated technical solutions** — web and mobile app development and maintenance · design and implementation of secure networks and IT systems · specialist technical support and consulting.
  - AR: **الخدمات الهندسية المتقدمة** — تركيب وصيانة منظومات المراقبة بالكاميرات وأجهزة الإنذار · تصميم وتطوير الأنظمة الإدارية والتطبيقات للشركات والمؤسسات · خدمات برمجية متكاملة ودعم فني داخلي لضمان استمرارية العمل.
    EN: **Advanced engineering services** — CCTV and alarm system installation and maintenance · management systems and applications for businesses and organizations · end-to-end software services with on-site support for business continuity.

---

## Contact
| Key | Arabic | English |
|---|---|---|
| contact.pageTitle | تواصل معنا | Contact us |
| contact.lead | يسعدنا سماعك. أرسل لنا رسالتك وسنعود إليك في أقرب وقت. | We'd love to hear from you. Send us a message and we'll get back to you soon. |
| contact.emailLabel | البريد الإلكتروني | Email |
| form.name | الاسم | Name |
| form.email | البريد الإلكتروني | Email |
| form.organization | الجهة / الشركة (اختياري) | Organization (optional) |
| form.service | الخدمة المطلوبة | Service of interest |
| form.serviceOther | أخرى | Other |
| form.message | رسالتك | Your message |
| form.submit | إرسال الرسالة | Send message |
| form.sending | جارٍ الإرسال… | Sending… |
| form.success | شكرًا لك، وصلت رسالتك وسنتواصل معك قريبًا. | Thank you — your message has arrived and we'll be in touch soon. |
| form.error | تعذّر إرسال الرسالة. حاول مرة أخرى أو راسلنا مباشرة على Info@Alaryam.ly | Your message couldn't be sent. Please try again or email us at Info@Alaryam.ly |
| form.required | هذا الحقل مطلوب | This field is required |
| form.invalidEmail | أدخل بريدًا إلكترونيًا صحيحًا | Enter a valid email address |

## 404
| Key | Arabic | English |
|---|---|---|
| notFound.title | الصفحة غير موجودة | Page not found |
| notFound.lead | ربما نُقلت الصفحة أو أن الرابط غير صحيح. | The page may have moved, or the link is incorrect. |
| notFound.back | العودة للرئيسية | Back to home |

## SEO (per page)
| Page | AR title | EN title |
|---|---|---|
| Home | شركة الأريام — الشريك التقني الآمن | AL-ARYAM — Your Secure Technical Partner |
| Services | خدماتنا — شركة الأريام | Services — AL-ARYAM |
| Service | {service.title} — شركة الأريام | {service.title} — AL-ARYAM |
| About | من نحن — شركة الأريام | About — AL-ARYAM |
| Contact | تواصل معنا — شركة الأريام | Contact — AL-ARYAM |

Meta description: use the page `lead`/`intro` (trim to ~155 chars).
