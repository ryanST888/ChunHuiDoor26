(() => {
  const STORAGE_KEY = "chunhui-language";
  const LANG_ZH = "zh";
  const LANG_EN = "en";
  const originalText = new WeakMap();
  const originalAttrs = new WeakMap();
  const TRANSLATED_ATTRS = ["placeholder", "aria-label", "alt", "title", "value", "content"];

  const textEn = {
    "中山春晖门业有限公司": "Zhongshan Chunhui Door Industry Co., Ltd.",
    "中山市春晖门业": "Zhongshan Chunhui Doors",
    "中山春晖门业": "Zhongshan Chunhui Doors",
    "春晖门业": "Chunhui Doors",
    "春晖门业官网": "Chunhui Doors Official Website",
    "春晖门业新闻中心": "Chunhui Doors News Center",
    "首页": "Home",
    "产品中心": "Products",
    "关于春晖": "About",
    "关于春晖门业": "About Chunhui Doors",
    "关于我们": "About Us",
    "新闻案例": "News & Cases",
    "新闻中心": "News Center",
    "联系我们": "Contact",
    "返回首页": "Back to Home",
    "产品详情": "Product Details",
    "产品中心导航": "Product Center Navigation",
    "产品详情导航": "Product Detail Navigation",
    "春晖门业联系方式": "Chunhui Doors Contact",
    "春晖门业联系我们与询盘": "Chunhui Doors Contact & Inquiry",
    "粤ICP备2025498719号-1": "ICP No. 2025498719-1",
    "广东省中山市五桂山镇龙塘工业大道7号": "No. 7 Longtang Industrial Avenue, Wuguishan Town, Zhongshan, Guangdong, China",
    "广东省中山市南区恒美园山仔工业区": "Yuanshanzai Industrial Area, Hengmei, South District, Zhongshan, Guangdong, China",
    "司徒春涛": "Situ Chuntao",
    "周一至周日 8:00 - 18:00": "Mon-Sun 8:00 - 18:00",

    "中山春晖门业有限公司 — 碳晶门/免漆门/生态门/工程门制造商": "Zhongshan Chunhui Doors - Carbon Crystal, Paint-free, Eco and Project Door Manufacturer",
    "产品中心 — 春晖门业": "Products - Chunhui Doors",
    "产品详情 — 春晖门业": "Product Details - Chunhui Doors",
    "关于我们 — 中山春晖门业有限公司": "About Us - Zhongshan Chunhui Doors",
    "新闻中心 — 春晖门业品牌动态、产品知识、选购指南与工程案例": "News Center - Brand Updates, Product Knowledge, Buying Guides and Project Cases",
    "联系我们 / 询盘 — 中山春晖门业有限公司": "Contact / Inquiry - Zhongshan Chunhui Doors",

    "产品 · 工厂 · 工程交付": "Products · Factory · Project Delivery",
    "面向家装、工程、酒店公寓与经销渠道的中高端室内门制造商": "A mid-to-high-end interior door manufacturer for home projects, commercial projects, hotels, apartments and dealers",
    "碳晶门 / 生态门 / 免漆门": "Carbon Crystal / Eco / Paint-free Doors",
    "工程批量配套": "Bulk Project Supply",
    "中山工厂交付": "Factory Delivery from Zhongshan",
    "室内门定制": "Custom Interior Doors",
    "获取产品方案": "Get Product Proposal",
    "查看产品系列": "View Product Series",
    "PRODUCTS": "PRODUCTS",
    "查看完整产品中心": "View Full Product Center",
    "制造实力与交付优势": "Manufacturing Strength & Delivery Advantages",
    "从需求沟通到稳定交付": "From Requirement Discussion to Stable Delivery",
    "猜你想问": "FAQ",
    "联系我们": "Contact",
    "在线留言 · 获取产品方案": "Online Inquiry · Get Product Proposal",
    "请前往联系页填写产品类型、项目数量、所在城市和交付时间，销售将根据需求尽快沟通方案。": "Please go to the contact page and share product type, quantity, city and delivery schedule. Our sales team will respond with a tailored proposal.",
    "前往联系页提交需求": "Submit Your Request",
    "在线预约": "Book Online",
    "或直接拨打": "Or call directly",
    "产品与工程咨询": "Product & Project Inquiry",
    "移动电话": "Mobile",
    "邮箱": "Email",
    "总部地址": "Head Office",
    "服务时间": "Service Hours",
    "版权所有": "All rights reserved",

    "2012年": "Since 2012",
    "创立时间": "Founded",
    "成立时间": "Founded",
    "全国合作门店": "Partner Stores Nationwide",
    "合作门店": "Partner Stores",
    "产品型号沉淀": "Product Models",
    "产品型号": "Product Models",
    "批量": "Bulk",
    "酒店公寓工程配套": "Hotel & Apartment Project Supply",
    "长期深耕室内门制造": "Long-term focus on interior door manufacturing",
    "中山": "Zhongshan",
    "制造基地": "Manufacturing Base",
    "服务华南及全国合作客户": "Serving South China and partners nationwide",
    "支持区域渠道与经销合作": "Supports regional channels and dealer cooperation",
    "覆盖多风格、多场景选型": "Covers multiple styles and scenarios",

    "全部": "All",
    "碳晶门": "Carbon Crystal Doors",
    "免漆门": "Paint-free Doors",
    "无漆门": "Paint-free Doors",
    "生态门": "Eco Doors",
    "工程门": "Project Doors",
    "实木烤漆门": "Solid Wood Painted Doors",
    "烤漆门": "Painted Doors",
    "铝木门": "Aluminum-Wood Doors",
    "室内门定制": "Custom Interior Doors",
    "家装客户": "Homeowners",
    "工程客户": "Project Clients",
    "酒店公寓": "Hotels & Apartments",
    "经销商": "Dealers",
    "装修公司": "Renovation Companies",
    "经销商 / 装修公司": "Dealers / Renovation Companies",
    "酒店 / 公寓": "Hotels / Apartments",
    "住宅 / 精装": "Residential / Fine Decoration",
    "经销 / 装企": "Dealer / Renovation Channel",

    "为不同需求，提供合适的室内门方案": "Interior Door Solutions for Different Needs",
    "无论是家庭装修、工程配套还是渠道合作，我们都可根据空间、预算、数量与交付需求提供产品建议。": "For home renovation, project supply or channel cooperation, we recommend products based on space, budget, quantity and delivery needs.",
    "按空间与预算选择适合的室内门": "Choose Interior Doors by Space and Budget",
    "适合新房装修、旧房翻新、全屋门定制。重点关注颜值、环保、耐用和整体家装搭配。": "For new homes, renovations and whole-house door customization, with focus on design, environmental performance, durability and overall matching.",
    "获取家装建议": "Get Home Selection Advice",
    "为酒店、公寓、精装项目提供稳定配套": "Stable Supply for Hotels, Apartments and Fine Decoration Projects",
    "适合批量供货、统一款式、分批交付和项目节点管理。重点关注交期、质量稳定和售后响应。": "For bulk supply, unified styles, phased delivery and project scheduling, with focus on lead time, quality consistency and after-sales response.",
    "咨询工程配套": "Ask About Project Supply",
    "丰富产品系列，支持长期渠道合作": "Rich Product Series for Long-term Channel Cooperation",
    "适合区域经销、设计师渠道、装修公司合作。重点关注产品系列、样品支持和长期供货稳定性。": "For regional dealers, designer channels and renovation companies, with focus on product range, sample support and stable long-term supply.",
    "了解合作方式": "Learn Cooperation Options",
    "产品图册": "Product Brochure",
    "样品支持": "Sample Support",
    "渠道合作": "Channel Cooperation",
    "长期供货": "Long-term Supply",
    "批量供货": "Bulk Supply",
    "项目配套": "Project Supply",
    "交付排期": "Delivery Scheduling",

    "国潮墨影系列，烟熏柚木纹理，时尚轻奢风格，演绎东方美学": "Chinese Ink Shadow series with smoked teak texture, a modern light-luxury style with Eastern aesthetics.",
    "健康无漆木门，防潮抗变，M9绿色健康板，同色一体化设计": "Healthy paint-free wood door with moisture resistance, deformation resistance, M9 green healthy board and color-matched integrated design.",
    "进口橡木，深雕工艺，立体感强，彰显高端品味": "Imported oak with deep-carving craftsmanship, strong three-dimensional texture and premium taste.",
    "辛格榆木纹理，简约现代风，适合年轻家居装修风格": "Singer elm texture with a clean modern style for younger home interiors.",
    "经典平雕设计，线条简洁流畅，百搭各种家装风格": "Classic flat-carved design with clean lines, suitable for many home styles.",
    "适合工程、公寓与家装定制，表面耐磨易打理，交付稳定": "Suitable for projects, apartments and home customization, with wear-resistant, easy-care surface and stable delivery.",
    "国潮系列": "Chinese Style Series",
    "健康环保": "Healthy & Eco-friendly",
    "匠心智造": "Crafted Manufacturing",
    "人气推荐": "Popular Pick",
    "经典款": "Classic",
    "工程适配": "Project Ready",
    "询价定制": "Custom Quotation",
    "立即咨询": "Inquire Now",

    "需求沟通": "Requirement Discussion",
    "确认客户类型、产品系列、空间场景、数量、预算和交付城市。": "Confirm customer type, product series, space scenario, quantity, budget and delivery city.",
    "产品建议": "Product Recommendation",
    "根据家装、工程、酒店、公寓或经销需求，推荐对应门类和表面工艺。": "Recommend door types and surface finishes according to home, project, hotel, apartment or dealer needs.",
    "方案报价": "Proposal & Quotation",
    "围绕材质、尺寸、数量、五金配置和交付节奏，形成初步报价参考。": "Prepare preliminary quotation based on material, size, quantity, hardware configuration and delivery rhythm.",
    "生产排期": "Production Scheduling",
    "确认订单信息后进入生产与质检流程，保障批量交付稳定。": "After order confirmation, production and quality inspection are scheduled to support stable bulk delivery.",
    "发货售后": "Shipping & After-sales",
    "配合项目节点发货，并提供后续安装、补件、维护等沟通支持。": "Ship according to project milestones and support follow-up installation, spare parts and maintenance communication.",

    "2012年创立，专注室内门稳定交付": "Founded in 2012, Focused on Stable Interior Door Delivery",
    "中山春晖门业有限公司位于广东中山，主营碳晶门、免漆门、生态门、工程门、实木烤漆门、铝木门及室内门定制。": "Zhongshan Chunhui Doors is based in Zhongshan, Guangdong, and focuses on carbon crystal doors, paint-free doors, eco doors, project doors, solid wood painted doors, aluminum-wood doors and custom interior doors.",
    "我们服务家装业主、酒店公寓工程、经销商和装修公司，重点解决选型、定制、批量供货、交期配合与售后响应问题。": "We serve homeowners, hotel and apartment projects, dealers and renovation companies, helping with selection, customization, bulk supply, delivery coordination and after-sales response.",
    "服务对象": "Client Types",
    "产品系列丰富": "Rich Product Series",
    "从家装室内门到工程门，覆盖不同预算、风格和使用场景": "From home interior doors to project doors, covering different budgets, styles and usage scenarios.",
    "工厂交付稳定": "Stable Factory Delivery",
    "围绕材料、工艺、质检、排期和批量供货建立标准流程": "Standard processes around materials, craftsmanship, quality inspection, scheduling and bulk supply.",
    "工程配套友好": "Project-friendly Supply",
    "适合酒店、公寓、精装项目等统一款式和分批交付需求": "Suitable for hotels, apartments and fine decoration projects requiring unified styles and phased delivery.",
    "渠道合作直接": "Direct Channel Cooperation",
    "支持经销商、装修公司沟通样品、图册、供货周期和售后": "Supports dealers and renovation companies with samples, brochures, supply cycles and after-sales communication.",
    "从选型到售后的服务支持": "Service Support from Selection to After-sales",
    "按空间、预算与项目需求推荐产品": "Recommend products by space, budget and project needs.",
    "配合批量项目的生产与交付安排": "Coordinate production and delivery for bulk projects.",
    "提供后续补货与售后沟通支持": "Support replenishment and after-sales communication.",
    "提交需求，获取产品建议": "Submit Your Request and Get Product Advice",

    "春晖门业主要生产哪些门类？": "What door types does Chunhui Doors produce?",
    "春晖门业主要覆盖碳晶门、免漆门、生态门、工程门、实木烤漆门、铝木门和室内门定制，可面向家装客户、工程客户、酒店公寓、经销商和装修公司提供产品方案。": "Chunhui Doors mainly covers carbon crystal doors, paint-free doors, eco doors, project doors, solid wood painted doors, aluminum-wood doors and custom interior doors, serving homeowners, project clients, hotels, apartments, dealers and renovation companies.",
    "工程项目或酒店公寓可以批量定制吗？": "Can project, hotel or apartment orders be customized in bulk?",
    "可以。工程客户可提供项目类型、数量、交付城市、目标风格和预算区间，我们会根据产品系列、工艺配置和交付节点给出初步建议。": "Yes. Project clients can provide project type, quantity, delivery city, target style and budget range. We will give preliminary advice based on product series, process configuration and delivery milestones.",
    "经销商或装修公司合作需要准备什么？": "What should dealers or renovation companies prepare for cooperation?",
    "建议先准备所在区域、经营渠道、目标客户类型和计划主推产品。后续可围绕产品图册、样品、供货周期和售后支持进行沟通。": "We recommend preparing your region, sales channels, target customer type and planned key products first. Then we can discuss brochures, samples, supply cycle and after-sales support.",

    "产品系列清晰": "Clear Product Series",
    "碳晶门、免漆门、生态门、工程门与室内门定制，覆盖家装和工程需求": "Carbon crystal doors, paint-free doors, eco doors, project doors and custom interior doors for home and project needs.",
    "工厂稳定交付": "Stable Factory Delivery",
    "围绕生产、质检、排期和批量供货建立流程，适合酒店公寓等项目配套": "Processes around production, inspection, scheduling and bulk supply, suitable for hotel and apartment projects.",
    "渠道合作友好": "Channel-friendly Cooperation",
    "面向经销商、装修公司和设计师渠道，支持产品图册、样品与长期供货": "For dealers, renovation companies and designer channels, supporting brochures, samples and long-term supply.",
    "咨询沟通便捷": "Convenient Inquiry",
    "产品、工程与经销需求均可通过电话、微信或表单沟通": "Product, project and dealer needs can be discussed by phone, WeChat or form.",
    "获取产品资料与工程报价": "Get Product Materials and Project Quotation",
    "留下需求后，我们将根据产品系列、空间场景和数量给出初步建议": "After you leave your request, we will provide preliminary advice based on product series, space scenario and quantity.",

    "按空间与项目需求，快速找到合适的门": "Quickly Find the Right Door by Space and Project Needs",
    "春晖门业围绕家装、酒店公寓、精装工程与经销展示需求，提供生态门、实木烤漆门、铝木门等室内门产品。先看品类方向，再比较款式与系列，选型会更清晰。": "Chunhui Doors provides eco doors, solid wood painted doors, aluminum-wood doors and other interior door products for home, hotel, apartment, fine decoration and dealer display needs. Start with categories, then compare styles and series.",
    "按品类选门": "Choose by Category",
    "查看全部产品": "View All Products",
    "家装选型": "Home Selection",
    "工程配套": "Project Supply",
    "酒店公寓": "Hotels & Apartments",
    "经销合作": "Dealer Cooperation",
    "快速导航": "Quick Navigation",
    "按浏览需求直接进入对应模块。": "Jump directly to the section you need.",
    "查看产品图册": "View Product Brochures",
    "筛选全部产品": "Filter All Products",
    "提交咨询需求": "Submit Inquiry",
    "先确定品类，再比较款式": "Choose the Category First, Then Compare Styles",
    "家装可重点比较风格与质感，工程项目可关注稳定交付，经销合作可查看系列完整度。选定品类后，再比较款式与配置会更清晰。": "For home projects, compare style and texture. For projects, focus on stable delivery. For dealers, review series completeness. Once the category is chosen, style and configuration comparison becomes clearer.",
    "产品电子图册": "Digital Product Brochures",
    "部分产品图册已整理为在线画册，可快速浏览系列款式、颜色和整体风格。若需要完整报价或工程配套建议，可将意向型号截图发给我们确认。": "Some product brochures are available online for quick review of styles, colors and overall direction. For full quotation or project advice, send us screenshots of preferred models.",
    "产品图册 01": "Product Brochure 01",
    "产品图册 02": "Product Brochure 02",
    "产品图册 03": "Product Brochure 03",
    "产品图册 04": "Product Brochure 04",
    "产品图册 05": "Product Brochure 05",
    "适合先快速浏览整体款式、门型与风格方向。": "Quickly browse overall styles, door types and design directions.",
    "适合查看不同系列的颜色、造型和空间搭配参考。": "View colors, shapes and space-matching references across different series.",
    "适合工程、经销和整装客户补充浏览更多产品款式。": "Browse more product styles for project, dealer and whole-house package needs.",
    "适合继续补充查看更多门型、饰面和系列组合。": "Continue reviewing more door types, finishes and series combinations.",
    "适合经销展示、工程选型和客户沟通时扩展参考。": "Use as extended reference for dealer displays, project selection and customer communication.",
    "新窗口打开": "Open in New Window",
    "获取更多详情，请联系我们": "For more details, please contact us",
    "提交需求": "Submit Request",
    "快速定位": "Quick Filter",
    "可按产品品类、系列或型号关键词查找。若不确定选哪类，可先从上方品类卡片进入。": "Search by product category, series or model keyword. If you are unsure, start with the category cards above.",
    "搜索产品": "Search Products",
    "输入图片名、系列或类别": "Enter image name, series or category",
    "类别": "Category",
    "系列": "Series",
    "全部产品": "All Products",
    "点击产品查看大图与选型信息；如需工程报价、经销图册或整装配套，可直接提交需求。": "Click a product to view the large image and selection information. For project quotation, dealer brochures or package supply, submit your request directly.",
    "项结果": "results",
    "没有找到匹配产品": "No Matching Products Found",
    "可以减少关键词，或切换到“全部”类别重新浏览。": "Try fewer keywords or switch back to All.",
    "需要产品图册、工程报价或经销合作？": "Need Product Brochures, Project Quotation or Dealer Cooperation?",
    "请告诉我们使用场景、意向品类、数量、项目城市和交付时间，春晖门业会结合产品系列与项目需求给出初步选型建议。": "Tell us your scenario, preferred category, quantity, project city and delivery schedule. Chunhui Doors will provide preliminary selection advice.",
    "关闭预览": "Close Preview",
    "快速预览": "Quick Preview",
    "按需询价": "Quotation on Request",
    "查看详情": "View Details",
    "适合重视质感、造型和空间档次的客户，可用于别墅、酒店、公寓和中高端家装。": "For clients who value texture, styling and space quality. Suitable for villas, hotels, apartments and mid-to-high-end homes.",
    "质感造型 / 门店主推 / 工程形象": "Textured Styling / Store Highlight / Project Image",
    "款式覆盖面广，适合现代家装、整装套餐、精装项目和装修公司主材配套。": "Wide style coverage for modern homes, whole-house packages, fine decoration projects and renovation company material packages.",
    "现代木纹 / 家装整配 / 批量选型": "Modern Wood Grain / Home Package / Bulk Selection",
    "兼顾结构稳定与简洁外观，适合关注耐用、防潮和统一交付的项目需求。": "Balances structural stability and simple appearance, suitable for projects focused on durability, moisture resistance and unified delivery.",
    "结构稳定 / 防潮耐用 / 工程配套": "Stable Structure / Moisture Resistance / Project Supply",
    "适合家装、工程、酒店公寓、经销商和装修公司按需选型。": "Suitable for on-demand selection by homeowners, projects, hotels, apartments, dealers and renovation companies.",
    "定制选型 / 配套交付 / 长期合作": "Custom Selection / Supporting Delivery / Long-term Cooperation",

    "选型关键信息": "Key Selection Information",
    "查看产品品类、系列、适用场景、可定制项和报价方式，了解该产品是否符合您的家装或项目需求。": "Review category, series, use scenarios, customization options and quotation method to see whether this product fits your home or project needs.",
    "适用场景": "Use Scenarios",
    "获取产品方案": "Get Product Proposal",
    "如需确认材质、尺寸、颜色、五金配置、工程数量或交付周期，可以提交需求，由春晖门业根据产品系列和项目条件给出初步建议。": "To confirm material, size, color, hardware, project quantity or delivery cycle, submit your request and Chunhui Doors will provide preliminary advice.",
    "咨询该产品": "Ask About This Product",
    "返回产品中心": "Back to Products",
    "同类产品推荐": "Related Products",
    "没有找到该产品": "Product Not Found",
    "可能是链接参数缺失或产品清单已更新。": "The link parameter may be missing or the product list may have been updated.",
    "适用客户": "Suitable Clients",
    "适配客户": "Suitable Clients",
    "报价方式": "Quotation Method",
    "咨询建议": "Inquiry Tip",
    "发送型号或截图更快确认": "Send model number or screenshot for faster confirmation",
    "按尺寸 / 数量 / 配置询价": "Quoted by size / quantity / configuration",
    "按尺寸、数量、材质与配置询价": "Quoted by size, quantity, material and configuration",
    "产品名称": "Product Name",
    "产品类别": "Product Category",
    "产品系列": "Product Series",
    "风格定位": "Style Positioning",
    "可定制项": "Customization Options",
    "交付沟通": "Delivery Discussion",
    "支持家装单套与工程批量需求确认": "Supports single home orders and bulk project requirement confirmation",
    "可按尺寸、数量与项目需求询价": "Quotation by size, quantity and project needs",
    "家装客户、别墅项目、酒店公寓、经销渠道": "Homeowners, villa projects, hotels, apartments and dealer channels",
    "家装客户、精装项目、装修公司、经销渠道": "Homeowners, fine decoration projects, renovation companies and dealer channels",
    "现代家装、工程配套、酒店公寓、装修公司": "Modern homes, project supply, hotels, apartments and renovation companies",
    "家装客户、工程客户、经销商和装修公司": "Homeowners, project clients, dealers and renovation companies",
    "颜色、尺寸、门套、五金与表面工艺": "Color, size, door frame, hardware and surface finish",
    "门型、饰面颜色、尺寸、门套与五金配置": "Door type, finish color, size, door frame and hardware configuration",
    "门型、颜色、尺寸、结构配置与五金方案": "Door type, color, size, structural configuration and hardware plan",
    "尺寸、颜色、门套、五金与项目配置": "Size, color, door frame, hardware and project configuration",
    "中高端家装": "Mid-to-high-end Homes",
    "适合卧室、书房、套房等需要质感表达的空间。": "Suitable for bedrooms, studies, suites and spaces requiring a premium texture.",
    "酒店与公寓": "Hotels & Apartments",
    "适合统一风格、批量采购和稳定交付的项目需求。": "Suitable for unified style, bulk procurement and stable project delivery.",
    "经销门店展示": "Dealer Store Display",
    "适合作为门店样品和高关注度主推系列。": "Suitable as store samples and high-attention key series.",
    "现代家居空间": "Modern Home Spaces",
    "适合简约、轻奢、自然木纹等多种室内风格。": "Suitable for minimalist, light-luxury and natural wood-grain interiors.",
    "精装与工程项目": "Fine Decoration & Project Use",
    "适合关注预算、交付效率和款式统一的批量项目。": "Suitable for bulk projects focused on budget, delivery efficiency and unified styles.",
    "装修公司配套": "Renovation Company Package",
    "适合作为整装套餐或主材配套方案的一部分。": "Suitable as part of a whole-house package or main material solution.",
    "现代住宅空间": "Modern Residential Spaces",
    "适合注重结构稳定、简洁外观和日常耐用性的室内空间。": "Suitable for interior spaces focused on structural stability, clean appearance and daily durability.",
    "工程批量配套": "Bulk Project Supply",
    "适合统一配置、统一交付和售后沟通的项目需求。": "Suitable for projects requiring unified configuration, delivery and after-sales communication.",
    "酒店公寓项目": "Hotel & Apartment Projects",
    "适合需要耐用、易维护和风格统一的批量空间。": "Suitable for bulk spaces requiring durability, easy maintenance and unified style.",
    "现代室内门定制": "Modern Interior Door Customization",
    "适合注重结构稳定和简洁外观的住宅空间。": "Suitable for residential spaces focused on stable structure and clean appearance.",
    "渠道合作展示": "Channel Cooperation Display",
    "适合经销商或装修公司作为差异化产品补充。": "Suitable as differentiated product supplements for dealers or renovation companies.",

    "关于春晖门业": "About Chunhui Doors",
    "以中山制造为基础，围绕碳晶门、免漆门、生态门、工程门与室内门定制，为家装、工程、酒店公寓和渠道客户提供稳定、清晰、可持续合作的门类方案。": "Based on manufacturing in Zhongshan, we provide stable, clear and sustainable door solutions for home, project, hotel, apartment and channel clients around carbon crystal, paint-free, eco, project and custom interior doors.",
    "提交合作需求": "Submit Cooperation Request",
    "查看产品中心": "View Products",
    "春晖门业核心数据": "Chunhui Doors Key Data",
    "COMPANY PROFILE": "COMPANY PROFILE",
    "春晖门业扎根广东中山，专注室内门制造与长期合作，持续为家装、工程和渠道客户提供稳定产品与交付服务。": "Chunhui Doors is rooted in Zhongshan, Guangdong, focusing on interior door manufacturing and long-term cooperation, continuously providing stable products and delivery services for home, project and channel clients.",
    "我们主营碳晶门、免漆门、生态门、工程门、实木烤漆门、铝木门及室内门定制，可根据不同空间、项目数量和合作需求，沟通产品系列、工艺配置、交付周期与售后方式。": "We focus on carbon crystal doors, paint-free doors, eco doors, project doors, solid wood painted doors, aluminum-wood doors and custom interior doors. We discuss product series, process configuration, delivery cycle and after-sales approach by space, quantity and cooperation needs.",
    "春晖门业产品与制造场景": "Chunhui Doors Products and Manufacturing Scene",
    "产品、工艺、交付节奏清楚，合作才更稳定。": "Clear products, processes and delivery rhythm make cooperation steadier.",
    "覆盖家装、工程与渠道的产品体系": "Product System Covering Homes, Projects and Channels",
    "从日常家装到酒店公寓、精装工程与渠道合作，提供覆盖多种风格、预算和交付需求的室内门产品。": "From daily home renovation to hotels, apartments, fine decoration projects and channel cooperation, we provide interior door products across styles, budgets and delivery needs.",
    "围绕产品选型、生产质检、项目排期、批量供货与售后响应建立清晰流程，让每一次合作更稳定、更省心。": "Clear processes around product selection, production inspection, project scheduling, bulk supply and after-sales response make every cooperation steadier and easier.",
    "无论是家庭装修、工程配套还是渠道合作，我们都根据实际需求提供对应的产品与服务支持。": "For home renovation, project supply or channel cooperation, we provide product and service support according to real needs.",
    "品牌发展节点": "Brand Milestones",
    "从制造积累到产品体系完善，持续服务家装、工程、酒店公寓与渠道合作客户。": "From manufacturing accumulation to a complete product system, we keep serving home, project, hotel, apartment and channel clients.",
    "合作前常见问题": "Common Questions Before Cooperation",
    "把产品类型、数量和交付城市告诉我们，先获得初步选型建议。": "Tell us product type, quantity and delivery city to get preliminary selection advice.",
    "联系春晖门业": "Contact Chunhui Doors",
    "适合现代家装、公寓和工程项目，表面耐磨易打理，风格克制。": "Suitable for modern homes, apartments and projects, with wear-resistant, easy-care surfaces and a restrained style.",
    "适合关注环保、效率和预算平衡的客户，维护成本低。": "Suitable for clients focused on environmental performance, efficiency and budget balance, with low maintenance cost.",
    "覆盖多种纹理与色系，适合年轻家居和批量选型。": "Covers multiple textures and colors, suitable for young homes and bulk selection.",
    "面向酒店、公寓、精装项目，重点关注规格统一与交付节奏。": "For hotels, apartments and fine decoration projects, with focus on unified specifications and delivery rhythm.",
    "适合更重视质感、造型和高端家居氛围的空间。": "For spaces that value texture, styling and a premium home atmosphere.",
    "兼顾结构稳定、健康无漆和现代空间表达。": "Balances structural stability, healthy paint-free materials and modern spatial expression.",
    "提供兼顾颜值、环保、预算、空间搭配与日常耐用的选门建议。": "Provides door selection advice balancing design, environmental performance, budget, space matching and daily durability.",
    "支持数量、规格、交期、质检与分批交付等项目需求。": "Supports project needs such as quantity, specification, lead time, quality inspection and phased delivery.",
    "支持统一风格、项目节点、后续补货与售后响应。": "Supports unified style, project milestones, replenishment and after-sales response.",
    "提供样品、图册、产品系列与长期稳定供货支持。": "Provides samples, brochures, product series and stable long-term supply support.",
    "配合方案沟通、项目选型与室内门产品配套。": "Supports proposal discussion, project selection and interior door product matching.",
    "春晖门业主要做哪些门？": "What doors does Chunhui Doors mainly make?",
    "春晖门业主营碳晶门、免漆门、生态门、工程门、实木烤漆门、铝木门和室内门定制，可覆盖家装、工程、酒店公寓、经销和装修公司配套需求。": "Chunhui Doors focuses on carbon crystal doors, paint-free doors, eco doors, project doors, solid wood painted doors, aluminum-wood doors and custom interior doors, covering home, project, hotel, apartment, dealer and renovation company needs.",
    "工程项目可以批量配套吗？": "Can projects be supplied in bulk?",
    "可以。工程客户可以提供项目类型、数量、交付城市、风格和预算区间，春晖门业会根据产品系列、工艺配置和交付节点给出初步建议。": "Yes. Project clients can provide project type, quantity, delivery city, style and budget range, and Chunhui Doors will give preliminary advice based on product series, process configuration and delivery milestones.",
    "经销商或装修公司适合合作吗？": "Are dealers or renovation companies suitable partners?",
    "适合。春晖门业可围绕产品体系、样品、图册、供货周期和售后方式沟通长期合作，帮助渠道客户形成更清晰的销售方案。": "Yes. Chunhui Doors can discuss long-term cooperation around product systems, samples, brochures, supply cycles and after-sales methods to help channel clients build clearer sales solutions.",
    "春晖门业成立，首条生产线投产": "Chunhui Doors was founded and the first production line went into operation.",
    "引进意大利、德国进口先进生产设备": "Introduced advanced production equipment from Italy and Germany.",
    "推出国潮墨影系列，市场反响热烈": "Launched the Chinese Ink Shadow series with strong market response.",
    "全国加盟门店突破500家，产品远销海外": "Nationwide franchise stores exceeded 500 and products were exported overseas.",

    "了解春晖门业的品牌动态、产品知识、选购指南和工程案例，为家装选门与项目配套提供实用参考。": "Explore Chunhui Doors brand updates, product knowledge, buying guides and project cases for practical reference in home selection and project supply.",
    "品牌动态": "Brand Updates",
    "产品知识": "Product Knowledge",
    "选购指南": "Buying Guide",
    "工程案例": "Project Cases",
    "新闻中心内容定位": "News Center Content Focus",
    "了解春晖门业的企业动态、渠道活动、新品系列与制造实力。": "Learn about company updates, channel activities, new series and manufacturing strength.",
    "了解碳晶门、免漆门、生态门、工程门和室内门定制的特点与适用场景。": "Understand the features and use scenarios of carbon crystal, paint-free, eco, project and custom interior doors.",
    "查看酒店、公寓、精装项目与经销展示等合作场景和配套经验。": "View cooperation scenarios and supply experience for hotels, apartments, fine decoration projects and dealer displays.",
    "重点推荐": "Featured",
    "精选门类差异、工艺特点、日常维护与工程需求准备等实用内容。": "Selected practical content about door category differences, process features, daily maintenance and project preparation.",
    "品牌资讯与产品知识": "Brand News & Product Knowledge",
    "工程与合作案例": "Project & Cooperation Cases",
    "覆盖酒店、公寓、家装、展厅和工程配套场景，呈现春晖门业的批量供货与定制交付经验。": "Covers hotels, apartments, home projects, showrooms and project supply scenarios, showing Chunhui Doors' bulk supply and custom delivery experience.",
    "选门与定制指南": "Door Selection & Customization Guide",
    "从产品特点、空间适配到工程采购准备，为不同需求提供更清晰的选门参考。": "From product features and space fit to project procurement preparation, offering clearer door selection references for different needs.",
    "门业客户常见问题": "Common Questions from Door Clients",
    "整理产品、定制与工程配套中的常见疑问，帮助您在咨询前了解关键信息。": "Common questions about products, customization and project supply, helping you understand key information before inquiry.",
    "如果你已经有产品系列、项目数量或交付城市，可以直接提交需求，我们会给出初步选型建议。": "If you already know the product series, project quantity or delivery city, submit your request and we will provide preliminary selection advice.",
    "提交产品或工程询盘": "Submit Product or Project Inquiry",
    "咨询相关产品": "Ask About Related Products",
    "咨询类似项目": "Ask About Similar Projects",
    "春晖木门丨这些木门保养的细节，你知道吗？": "Chunhui Wood Doors | Do You Know These Door Maintenance Details?",
    "春晖木门教你几招家里木门的保养方法：木门清洁四忌、木门清洁五推荐、木门日常使用维护。为了保持木门表面的光泽度和延长使用寿命，应该定期对木门进行维护保养。": "Chunhui Wood Doors shares practical home wood door maintenance tips: cleaning cautions, recommended cleaning methods and daily use care. Regular maintenance helps preserve surface gloss and extend service life.",
    "保养知识": "Maintenance Tips",
    "春晖木门丨论选对好木门对家居空间的重要性": "Chunhui Wood Doors | Why Choosing the Right Wood Door Matters for Home Spaces",
    "木门是每个家庭的必备品，木门属于耐用品，最考验选材的优质性，耐用性。春晖木门采用进口木材，通过国标层层检查，反复测试，为您打造高品质家居空间。": "Wood doors are essential durable products for every home, and material quality matters. Chunhui Wood Doors uses imported timber, national-standard inspections and repeated testing to create high-quality home spaces.",
    "春晖木门 | 化繁为简，细品美好生活": "Chunhui Wood Doors | Simplify and Enjoy Better Living",
    "越少越显高级感。简约而不简单，一个具有格调品质及艺术气息的理想之家。在这个光与生活融合为一的灵韵空间里，优越不言自彰。春晖木门，为美好生活而生。": "Less can feel more premium. Simple yet refined, an ideal home with taste, quality and artistry. In a space where light and life blend together, quality speaks for itself. Chunhui Wood Doors, made for better living.",
    "酒店公寓工程门配套": "Hotel & Apartment Project Door Supply",
    "面向批量项目，重点关注统一款式、交付节奏、耐用性和后续补件响应。": "For bulk projects, focusing on unified styles, delivery rhythm, durability and follow-up parts response.",
    "交付稳定": "Stable Delivery",
    "家装全屋室内门定制": "Whole-house Interior Door Customization",
    "家装案例": "Home Case",
    "根据空间风格、预算和家庭成员使用习惯，推荐生态门、免漆门或碳晶门系列。": "Recommend eco, paint-free or carbon crystal door series according to space style, budget and family usage habits.",
    "家装搭配": "Home Matching",
    "经销门店产品展示体系": "Dealer Store Product Display System",
    "渠道案例": "Channel Case",
    "提供产品图册、样品展示和主推系列支持，便于门店开展产品介绍与客户沟通。": "Provides brochures, sample display and key series support to help stores introduce products and communicate with customers.",
    "经销合作": "Dealer Cooperation",
    "产品体系": "Product System",
    "碳晶门适合哪些场景？": "What Scenarios Are Carbon Crystal Doors Suitable For?",
    "了解碳晶门在耐磨、易打理、工程配套和家装空间中的应用。": "Learn how carbon crystal doors apply to wear resistance, easy care, project supply and home spaces.",
    "免漆门和生态门怎么选？": "How to Choose Paint-free Doors and Eco Doors?",
    "从材料、表面工艺、预算和风格适配等方面进行比较。": "Compare by material, surface process, budget and style fit.",
    "工程门批量采购要注意什么？": "What Should You Note When Buying Project Doors in Bulk?",
    "了解数量、尺寸、交期、安装、补件和售后等采购要点。": "Understand purchase points such as quantity, size, lead time, installation, spare parts and after-sales.",
    "室内门定制需要提供哪些信息？": "What Information Is Needed for Custom Interior Doors?",
    "指导客户准备户型、尺寸、风格、预算、数量和交付城市。": "Guides clients to prepare layout, size, style, budget, quantity and delivery city.",

    "把需求说清楚，报价和方案才会更准确": "Clear Requirements Make Quotations and Proposals More Accurate",
    "无论是家装选门、酒店公寓工程配套，还是经销合作与装修公司长期供货，都可以从这里提交需求。": "Whether you need home door selection, hotel/apartment project supply, dealer cooperation or long-term supply for renovation companies, submit your request here.",
    "填写询盘": "Fill Inquiry",
    "电话咨询": "Call Us",
    "先选择你的咨询类型": "Choose Your Inquiry Type First",
    "提交产品或工程需求": "Submit Product or Project Request",
    "请留下产品类型、项目数量、所在城市和交付时间，我们会根据需求尽快沟通方案。": "Please leave product type, project quantity, city and delivery time. We will discuss a proposal as soon as possible.",
    "春晖门业官网新询盘": "New Inquiry from Chunhui Doors Website",
    "姓名 / 称呼": "Name",
    "请输入姓名": "Enter your name",
    "联系电话": "Phone",
    "请输入手机号": "Enter your phone number",
    "所在城市": "City",
    "如：广东中山": "e.g. Zhongshan, Guangdong",
    "客户类型": "Customer Type",
    "酒店 / 公寓": "Hotel / Apartment",
    "关注产品": "Product of Interest",
    "暂不确定，需要推荐": "Not sure, need recommendation",
    "预计数量": "Estimated Quantity",
    "如：家装5樘 / 工程200樘": "e.g. 5 doors for home / 200 doors for project",
    "需求说明": "Requirement Details",
    "请补充项目类型、风格、预算、交付时间、是否需要样品或图册等": "Add project type, style, budget, delivery time, and whether samples or brochures are needed.",
    "提交需求 · 等待联系": "Submit Request · Wait for Contact",
    "微信咨询": "WeChat Inquiry",
    "扫码添加，发送产品或工程需求": "Scan to add us and send product or project needs.",
    "微信咨询 2": "WeChat Inquiry 2",
    "备用微信二维码，便于不同咨询需求快速沟通": "Backup WeChat QR code for different inquiry needs.",
    "广东中山制造基地": "Zhongshan, Guangdong Manufacturing Base",
    "在地图中搜索春晖门业": "Search Chunhui Doors on Map",
    "到访春晖门业": "Visit Chunhui Doors",
    "建议到访前提前电话联系，便于安排产品、工程或渠道合作沟通。": "Please call before visiting so we can arrange product, project or channel cooperation discussion.",
    "导航搜索": "Navigation Search",
    "打开高德地图导航": "Open Amap Navigation",
    "提交后，我们如何跟进": "How We Follow Up After Submission",
    "家装选门": "Home Door Selection",
    "适合新房装修、旧房翻新、全屋门定制，重点沟通风格、预算、环保和交付时间。": "For new homes, renovations and whole-house door customization, focusing on style, budget, environmental performance and delivery time.",
    "工程配套": "Project Supply",
    "适合酒店、公寓、精装房、批量项目，重点沟通数量、交期、规格和稳定供货。": "For hotels, apartments, fine decoration houses and bulk projects, focusing on quantity, lead time, specifications and stable supply.",
    "工程门 / 批量交付": "Project Doors / Bulk Delivery",
    "渠道合作": "Channel Cooperation",
    "适合经销商、装修公司、设计师渠道，重点沟通产品体系、样品、图册和长期供货。": "For dealers, renovation companies and designer channels, focusing on product system, samples, brochures and long-term supply.",
    "经销 / 装企 / 样品支持": "Dealer / Renovation / Sample Support",
    "确认需求": "Confirm Requirements",
    "先确认产品类型、客户类型、数量、城市与交付时间。": "First confirm product type, customer type, quantity, city and delivery time.",
    "初步建议": "Preliminary Advice",
    "根据家装、工程或渠道需求，推荐对应产品系列与配置方向。": "Recommend product series and configuration direction based on home, project or channel needs.",
    "报价沟通": "Quotation Discussion",
    "结合尺寸、工艺、数量、五金和物流信息，进一步沟通报价。": "Discuss quotation further based on size, process, quantity, hardware and logistics.",
    "样品与资料": "Samples & Materials",
    "如需经销或工程合作，可进一步沟通图册、样品和项目资料。": "For dealer or project cooperation, we can further discuss brochures, samples and project materials.",
    "正在提交，请稍候...": "Submitting, please wait...",
    "提交失败": "Submission failed",
    "询盘已发送，销售将尽快与您联系。": "Inquiry sent. Our sales team will contact you soon.",
    "提交未成功，请稍后重试，或直接拨打 0760-8820 3678。": "Submission failed. Please try again later or call 0760-8820 3678.",
  };

  const phraseEn = [
    ["中山市春晖门业", "Zhongshan Chunhui Doors"],
    ["中山春晖门业有限公司", "Zhongshan Chunhui Door Industry Co., Ltd."],
    ["春晖门业", "Chunhui Doors"],
    ["产品详情", "Product Details"],
    ["碳晶门", "Carbon Crystal Doors"],
    ["免漆门", "Paint-free Doors"],
    ["无漆门", "Paint-free Doors"],
    ["生态门", "Eco Doors"],
    ["工程门", "Project Doors"],
    ["实木烤漆门", "Solid Wood Painted Doors"],
    ["烤漆门", "Painted Doors"],
    ["铝木门", "Aluminum-Wood Doors"],
    ["室内门定制", "Custom Interior Doors"],
    ["国潮墨影系", "Chinese Ink Shadow Series "],
    ["玻璃门系列", "Glass Door Series "],
    ["橡木深雕门系列", "Oak Deep-carved Door Series "],
    ["橡木池板门系列", "Oak Panel Door Series "],
    ["平雕门系列", "Flat-carved Door Series "],
    ["木皮工艺门系列", "Veneer Craft Door Series "],
    ["时尚白门系列", "Fashion White Door Series "],
    ["轻奢极简系列", "Light Luxury Minimalist Series "],
    ["M9系列", "M9 Series "],
    ["同色", "Color-matched "],
    ["健康无漆木门", "Healthy Paint-free Wood Door"],
    ["防潮抗变", "Moisture Resistant & Deformation Resistant"],
    ["绿色健康板", "Green Healthy Board"],
    ["现代净面系列", "Modern Flat Surface Series"],
    ["曲美", "Qumei "],
    ["冰山白", "Iceberg White"],
    ["塞纳灰", "Seine Gray"],
    ["烟熏柚木1", "Smoked Teak 1"],
    ["烟熏柚木2", "Smoked Teak 2"],
    ["烟熏柚木3", "Smoked Teak 3"],
    ["烟熏柚木", "Smoked Teak"],
    ["枫香梨木", "Sweetgum Pear Wood"],
    ["里德胡桃", "Reed Walnut"],
    ["辛格榆木", "Singer Elm"],
    ["黑", "Black"],
    ["金", "Gold"],
    ["系列", "Series"],
    ["询价定制", "Custom Quotation"],
    ["按需询价", "Quotation on Request"],
    ["查看详情", "View Details"],
    ["快速预览", "Quick Preview"],
    ["搜索：", "Search: "],
    ["现代木纹 / 家装整配 / 批量选型", "Modern Wood Grain / Home Package / Bulk Selection"],
    ["质感造型 / 门店主推 / 工程形象", "Textured Styling / Store Highlight / Project Image"],
    ["结构稳定 / 防潮耐用 / 工程配套", "Stable Structure / Moisture Resistance / Project Supply"],
    ["定制选型 / 配套交付 / 长期合作", "Custom Selection / Supporting Delivery / Long-term Cooperation"],
    ["定制 / 配套 / 交付稳定", "Custom / Supporting Supply / Stable Delivery"],
    [" — 春晖门业产品详情", " - Chunhui Doors Product Details"],
    [" — 春晖门业", " - Chunhui Doors"],
    [" / ", " / "],
  ];

  function getStoredLanguage() {
    const urlLang = new URLSearchParams(window.location.search).get("lang");
    if (urlLang === LANG_EN || urlLang === LANG_ZH) return urlLang;
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved === LANG_EN || saved === LANG_ZH) return saved;
    } catch (error) {
      return LANG_ZH;
    }
    return LANG_ZH;
  }

  let currentLanguage = getStoredLanguage();

  function normalize(value) {
    return String(value).replace(/\s+/g, " ").trim();
  }

  function cleanupEnglish(value) {
    return value
      .replaceAll("（", "(")
      .replaceAll("）", ")")
      .replaceAll("，", ", ")
      .replaceAll("。", ".")
      .replaceAll("；", "; ")
      .replaceAll("：", ": ")
      .replaceAll("、", ", ")
      .replaceAll("·", " - ")
      .replaceAll("—", "-")
      .replace(/\s+/g, " ")
      .replace(/\s+([,.;:)])/g, "$1")
      .replace(/\(\s+/g, "(")
      .replace(/\s+\)/g, ")")
      .replace(/Series\s+([A-Z0-9])/g, "Series $1")
      .replace(/([0-9])([A-Za-z])/g, "$1 $2")
      .replace(/([a-z])([A-Z0-9])/g, "$1 $2")
      .trim();
  }

  function toEnglish(value) {
    const source = normalize(value);
    if (!source) return value;
    if (textEn[source]) return textEn[source];

    if (source.startsWith("搜索：")) {
      return source.replace("搜索：", "Search: ");
    }

    if (source.startsWith("咨询与") && source.endsWith("相关的产品")) {
      const title = source.slice(3, -5);
      return `Ask about products related to ${toEnglish(title)}`;
    }

    if (source.startsWith("咨询") && source.endsWith("相关内容")) {
      const title = source.slice(2, -4);
      return `Ask about content related to ${toEnglish(title)}`;
    }

    if (source.startsWith("咨询") && source.endsWith("案例合作")) {
      const title = source.slice(2, -4);
      return `Ask about a similar project to ${toEnglish(title)}`;
    }

    let translated = source;
    phraseEn.forEach(([zh, en]) => {
      translated = translated.split(zh).join(en);
    });

    return translated === source ? value : cleanupEnglish(translated);
  }

  function translateValue(value) {
    if (currentLanguage === LANG_ZH) return value;
    return toEnglish(value);
  }

  function isSkippedElement(element) {
    if (!element) return false;
    if (element.closest && element.closest("[data-i18n-skip]")) return true;
    return ["SCRIPT", "STYLE", "NOSCRIPT", "TEXTAREA"].includes(element.tagName);
  }

  function translateTextNode(node) {
    const parent = node.parentElement;
    if (isSkippedElement(parent)) return;
    if (!originalText.has(node)) originalText.set(node, node.nodeValue);
    const source = originalText.get(node);
    const target = currentLanguage === LANG_ZH ? source : preserveSpacing(source, translateValue(source));
    if (node.nodeValue !== target) node.nodeValue = target;
  }

  function preserveSpacing(source, translated) {
    const trimmed = String(source).trim();
    if (!trimmed) return source;
    return String(source).replace(trimmed, translated);
  }

  function translateAttributes(element) {
    if (isSkippedElement(element)) return;
    TRANSLATED_ATTRS.forEach((attr) => {
      if (!element.hasAttribute(attr)) return;
      const originalMap = originalAttrs.get(element) || {};
      if (!Object.prototype.hasOwnProperty.call(originalMap, attr)) {
        originalMap[attr] = element.getAttribute(attr);
        originalAttrs.set(element, originalMap);
      }
      const source = originalMap[attr];
      const target = currentLanguage === LANG_ZH ? source : translateValue(source);
      if (element.getAttribute(attr) !== target) element.setAttribute(attr, target);
    });
  }

  function walk(root = document.body) {
    if (!root) return;
    if (root.nodeType === Node.TEXT_NODE) {
      translateTextNode(root);
      return;
    }
    if (root.nodeType !== Node.ELEMENT_NODE && root.nodeType !== Node.DOCUMENT_NODE) return;

    if (root.nodeType === Node.ELEMENT_NODE) translateAttributes(root);
    const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT | NodeFilter.SHOW_ELEMENT, {
      acceptNode(node) {
        if (node.nodeType === Node.ELEMENT_NODE && isSkippedElement(node)) {
          return NodeFilter.FILTER_REJECT;
        }
        return NodeFilter.FILTER_ACCEPT;
      },
    });

    let node = walker.nextNode();
    while (node) {
      if (node.nodeType === Node.TEXT_NODE) translateTextNode(node);
      if (node.nodeType === Node.ELEMENT_NODE) translateAttributes(node);
      node = walker.nextNode();
    }
  }

  function updateDocumentMeta() {
    document.documentElement.lang = currentLanguage === LANG_EN ? "en" : "zh-CN";
    document.documentElement.dataset.lang = currentLanguage;
    if (!document.documentElement.dataset.originalTitle) {
      document.documentElement.dataset.originalTitle = document.title;
    }
    const title = document.documentElement.dataset.originalTitle;
    document.title = currentLanguage === LANG_ZH ? title : translateValue(title);
  }

  function switchLanguage(lang) {
    currentLanguage = lang === LANG_EN ? LANG_EN : LANG_ZH;
    try {
      localStorage.setItem(STORAGE_KEY, currentLanguage);
    } catch (error) {
      // localStorage can be unavailable in some preview contexts.
    }
    updateDocumentMeta();
    updateSwitcherState();
    walk();
    window.dispatchEvent(new CustomEvent("chunhui:languagechange", { detail: { lang: currentLanguage } }));
  }

  function injectStyles() {
    if (document.getElementById("chunhui-i18n-style")) return;
    const style = document.createElement("style");
    style.id = "chunhui-i18n-style";
    style.textContent = `
      .language-switch {
        display: inline-flex;
        align-items: center;
        gap: 2px;
        height: 34px;
        padding: 2px;
        margin-left: 16px;
        border: 1px solid rgba(226,196,142,0.45);
        border-radius: 999px;
        background: rgba(20,22,21,0.36);
        color: #fffaf4;
        backdrop-filter: blur(10px);
        -webkit-backdrop-filter: blur(10px);
        flex: 0 0 auto;
      }
      .language-switch button {
        min-width: 38px;
        height: 28px;
        border: 0;
        border-radius: 999px;
        padding: 0 9px;
        background: transparent;
        color: rgba(255,250,244,0.72);
        font: 700 12px/1 system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        letter-spacing: 0;
        cursor: pointer;
        transition: color .2s ease, background .2s ease;
      }
      .language-switch button.is-active {
        background: #e2c48e;
        color: #261b18;
      }
      .language-switch button:focus-visible {
        outline: 2px solid #fffaf4;
        outline-offset: 2px;
      }
      #navbar .language-switch,
      .subpage-home-nav .language-switch {
        margin-left: 16px;
      }
      #navbar .language-switch + .hamburger {
        margin-left: 12px;
      }
      html[data-lang="en"] .nav-links,
      html[data-lang="en"] .site-nav,
      html[data-lang="en"] .subpage-home-nav .nav-links {
        gap: clamp(14px, 1.8vw, 24px);
      }
      html[data-lang="en"] .nav-logo-company,
      html[data-lang="en"] .brand-company,
      html[data-lang="en"] .subpage-home-nav .nav-logo-company {
        font-size: clamp(16px, 1.35vw, 20px);
        letter-spacing: 0.02em;
      }
      html[data-lang="en"] .nav-logo,
      html[data-lang="en"] .brand,
      html[data-lang="en"] .subpage-home-nav .nav-logo {
        min-width: 300px;
      }
      @media (max-width: 1080px) {
        .language-switch {
          height: 32px;
        }
        .language-switch button {
          min-width: 34px;
          height: 26px;
          padding: 0 8px;
        }
        html[data-lang="en"] .nav-logo,
        html[data-lang="en"] .brand,
        html[data-lang="en"] .subpage-home-nav .nav-logo {
          min-width: 0;
        }
      }
      @media (max-width: 768px) {
        #navbar .language-switch,
        .subpage-home-nav .language-switch {
          margin-left: auto;
        }
        .site-header {
          position: sticky;
        }
        .site-header > .language-switch {
          position: absolute;
          top: 16px;
          right: 20px;
          margin-left: 0;
        }
        .site-header .site-nav {
          padding-right: 94px;
        }
      }
    `;
    document.head.appendChild(style);
  }

  function injectSwitcher() {
    if (document.querySelector(".language-switch")) return;
    const header = document.querySelector("#navbar, .site-header, .subpage-home-nav, header");
    if (!header) return;
    const switcher = document.createElement("div");
    switcher.className = "language-switch";
    switcher.dataset.i18nSkip = "true";
    switcher.setAttribute("role", "group");
    switcher.setAttribute("aria-label", "Language");
    switcher.innerHTML = `
      <button type="button" data-lang="zh">中</button>
      <button type="button" data-lang="en">EN</button>
    `;

    const hamburger = header.querySelector(".hamburger");
    if (hamburger) {
      header.insertBefore(switcher, hamburger);
    } else {
      header.appendChild(switcher);
    }

    switcher.addEventListener("click", (event) => {
      const button = event.target.closest("button[data-lang]");
      if (!button) return;
      switchLanguage(button.dataset.lang);
    });
    updateSwitcherState();
  }

  function updateSwitcherState() {
    document.querySelectorAll(".language-switch button[data-lang]").forEach((button) => {
      const active = button.dataset.lang === currentLanguage;
      button.classList.toggle("is-active", active);
      button.setAttribute("aria-pressed", String(active));
    });
  }

  function observeMutations() {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        mutation.addedNodes.forEach((node) => walk(node));
        if (mutation.type === "attributes") translateAttributes(mutation.target);
      });
      updateDocumentMeta();
    });
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: TRANSLATED_ATTRS,
    });
  }

  function init() {
    injectStyles();
    injectSwitcher();
    updateDocumentMeta();
    walk();
    observeMutations();
  }

  window.CH_I18N = {
    get lang() {
      return currentLanguage;
    },
    setLanguage: switchLanguage,
    apply: walk,
    toEnglish,
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
