import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { motion } from 'framer-motion';
import { Shield, Lock, Eye, Globe, Mail } from 'lucide-react';

export default function Privacy() {
    return (
        <div className="min-h-screen flex flex-col bg-slate-50">
            <Navbar />

            <main className="flex-1 pt-24 pb-16">
                <div className="container mx-auto px-4 md:px-6 lg:px-8 max-w-5xl">
                    {/* Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="text-center mb-12"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-green-600/10 border border-green-600/20 text-green-700 text-sm font-bold uppercase tracking-wider mb-6">
                            <Shield className="w-4 h-4" />
                            Privacy & Data Protection
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4">Privacy Policy</h1>
                        <p className="text-lg text-slate-600">Lohakart Registration Website Privacy Policy</p>
                        <p className="text-sm text-slate-500 mt-2">Last Updated: January 2026</p>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-white rounded-2xl shadow-lg border border-slate-200 p-8 md:p-12"
                    >
                        <div className="prose prose-slate max-w-none">
                            {/* Introduction */}
                            <div className="mb-8 p-6 bg-green-50 rounded-xl border-l-4 border-green-600">
                                <p className="text-sm leading-relaxed text-slate-700">
                                    <strong>Lohakart (Indiium Ventures Private Limited)</strong> and its affiliates (collectively referred to herein as "Lohakart", "we", or "us") respect your privacy. Here is how we collect, share, use, and protect the information we collect from or about you on this website. All personal information, including information for Indian and non-Indian users of the Website, are processed by and retained on servers located in India in accordance with Indian privacy laws.
                                </p>
                            </div>

                            {/* Information We Collect */}
                            <section className="mb-10">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-[#005081] text-white">
                                        <Eye className="w-5 h-5" />
                                    </span>
                                    Information We Collect About You
                                </h2>

                                <p className="text-slate-700 mb-6">
                                    We collect information about you from a variety of sources, including you and the device you use to access our website.
                                </p>

                                <div className="space-y-6">
                                    <div className="bg-blue-50 p-6 rounded-xl border border-blue-200">
                                        <h3 className="font-bold text-blue-900 mb-4">Information You Provide to Us</h3>
                                        <p className="text-sm text-blue-800 mb-3">
                                            We collect information that you voluntarily share with us or permit us to receive, including:
                                        </p>
                                        <ul className="text-sm text-blue-800 space-y-2 list-disc list-inside">
                                            <li>Your name and the name of your employer</li>
                                            <li>Contact information (email, phone, mailing address)</li>
                                            <li>Information entered into request forms or via email</li>
                                            <li>Username and password for your account</li>
                                            <li>Types of material you're interested in buying or selling</li>
                                            <li>Auction bids or counteroffers</li>
                                            <li>Location addresses for materials</li>
                                        </ul>
                                    </div>

                                    <div className="bg-purple-50 p-6 rounded-xl border border-purple-200">
                                        <h3 className="font-bold text-purple-900 mb-4">Information We Collect Through Technology</h3>
                                        <p className="text-sm text-purple-800 mb-3">
                                            When you visit the Website, we may collect:
                                        </p>
                                        <ul className="text-sm text-purple-800 space-y-2 list-disc list-inside">
                                            <li>Domain name and IP address</li>
                                            <li>Browser version and operating system</li>
                                            <li>Website navigation history</li>
                                            <li>Device identification</li>
                                        </ul>
                                    </div>
                                </div>
                            </section>

                            {/* Cookies */}
                            <section className="mb-10">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                    <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-500 text-white">
                                        <Lock className="w-5 h-5" />
                                    </span>
                                    Cookies & Tracking
                                </h2>

                                <div className="space-y-4">
                                    <div>
                                        <h3 className="font-bold text-slate-800 mb-2">Cookies</h3>
                                        <p className="text-slate-700 leading-relaxed">
                                            Cookies are small files that we transfer to your computer's hard drive through your web browser that enable us to recognize your browser and capture certain information. We use Cookies to help us understand and save your preferences and to recognize you as a returning visitor.
                                        </p>
                                    </div>

                                    <div>
                                        <h3 className="font-bold text-slate-800 mb-2">'Do Not Track' Browser Setting</h3>
                                        <p className="text-slate-700 leading-relaxed">
                                            Our Website does not currently respond to DNT browser settings.
                                        </p>
                                    </div>

                                    <div className="bg-slate-100 p-4 rounded-lg">
                                        <h3 className="font-bold text-slate-800 mb-2">Google Analytics</h3>
                                        <p className="text-sm text-slate-700 leading-relaxed">
                                            We use Google Analytics to track and report website traffic. Google may use this data to personalize advertisements. For more information, visit <a href="https://policies.google.com" target="_blank" rel="noopener noreferrer" className="text-[#be1800] hover:underline">https://policies.google.com</a>
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* How We Use Information */}
                            <section className="mb-10">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">How We Use the Information We Collect</h2>
                                <p className="text-slate-700 leading-relaxed">
                                    We use the information we collect about you to:
                                </p>
                                <ul className="text-slate-700 space-y-2 list-disc list-inside mt-4">
                                    <li>Register and enroll you</li>
                                    <li>List and sell your material</li>
                                    <li>Contact you regarding services</li>
                                    <li>Arrange pickup or delivery of materials</li>
                                    <li>Improve our product offering and your user experience</li>
                                </ul>
                            </section>

                            {/* How We Share Information */}
                            <section className="mb-10">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">How We May Share Information About You</h2>
                                <div className="bg-green-50 border-l-4 border-green-600 p-6 rounded-r-xl">
                                    <p className="text-slate-800 leading-relaxed">
                                        <strong className="text-green-900">We do not sell your personal information to third parties.</strong> We may share your personal information with business associates and third-party service providers in order to provide services to you. We require our business associates and third-party service providers to safeguard your personal information in a manner consistent with this Privacy Policy.
                                    </p>
                                </div>
                            </section>

                            {/* Security */}
                            <section className="mb-10">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-3">
                                    <Shield className="w-8 h-8 text-[#005081]" />
                                    How We Protect the Information We Collect
                                </h2>
                                <p className="text-slate-700 leading-relaxed mb-4">
                                    The security and confidentiality of your personal information is important to us. We have implemented security measures including:
                                </p>
                                <ul className="text-slate-700 space-y-2 list-disc list-inside">
                                    <li>Electronic data encryption</li>
                                    <li>Secure, restricted server areas</li>
                                    <li>Limited employee access to personal information</li>
                                </ul>
                                <p className="text-sm text-amber-700 mt-4 bg-amber-50 p-4 rounded-lg">
                                    <strong>Important:</strong> No security measure is failsafe. Please maintain the secrecy of your login information and log out when not actively using the site.
                                </p>
                            </section>

                            {/* Payments */}
                            <section className="mb-10">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">Payments & Commercial Credit</h2>
                                <div className="space-y-4">
                                    <p className="text-slate-700 leading-relaxed">
                                        <strong>Payment Processing:</strong> We use third-party service providers for payment processing. We will not store or collect your credit card information. That information is provided directly to our third-party processors.
                                    </p>
                                    <p className="text-slate-700 leading-relaxed">
                                        <strong>Commercial Credit:</strong> When you apply for credit with Lohakart, you may be providing information directly to third-party credit providers, subject to their privacy policies.
                                    </p>
                                </div>
                            </section>

                            {/* Your Rights */}
                            <section className="mb-10">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">Your Rights Concerning Your Information</h2>
                                <p className="text-slate-700 mb-4">If you provide us with personally identifiable information, you have the right to:</p>
                                <div className="grid md:grid-cols-2 gap-4">
                                    {[
                                        'Review your information',
                                        'Request corrections or updates',
                                        'Opt out of contact',
                                        'Request removal from solicitation lists',
                                        'Request deletion of your information',
                                        'Opt out of being solicited'
                                    ].map((right, index) => (
                                        <div key={index} className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg">
                                            <div className="w-6 h-6 rounded-full bg-[#005081] text-white flex items-center justify-center flex-shrink-0 text-xs font-bold mt-0.5">
                                                {index + 1}
                                            </div>
                                            <span className="text-sm text-slate-700">{right}</span>
                                        </div>
                                    ))}
                                </div>
                            </section>

                            {/* Policy Updates */}
                            <section className="mb-10">
                                <h2 className="text-2xl font-bold text-slate-900 mb-6">Privacy Policy Updates</h2>
                                <p className="text-slate-700 leading-relaxed">
                                    We reserve the right to change this Privacy Policy at any time without notice. Changes will be posted to this page and are effective immediately upon posting. If we materially change this Privacy Policy, we will notify you by prominently posting a notice on the Website. Your continued use of the Website following effective date constitutes your acceptance of those changes.
                                </p>
                            </section>

                            {/* Contact & Jurisdiction */}
                            <div className="grid md:grid-cols-2 gap-6 mt-12">
                                <div className="bg-slate-100 p-6 rounded-xl border border-slate-300">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Mail className="w-6 h-6 text-[#005081]" />
                                        <h3 className="font-bold text-slate-900">Contact Information</h3>
                                    </div>
                                    <p className="text-sm text-slate-700 mb-3">
                                        For questions or concerns regarding our Privacy Policy:
                                    </p>
                                    <a href="mailto:business@lohakart.com" className="text-[#be1800] hover:underline font-semibold">
                                        business@lohakart.com
                                    </a>
                                </div>

                                <div className="bg-slate-100 p-6 rounded-xl border border-slate-300">
                                    <div className="flex items-center gap-3 mb-4">
                                        <Globe className="w-6 h-6 text-[#005081]" />
                                        <h3 className="font-bold text-slate-900">Governing Law</h3>
                                    </div>
                                    <p className="text-sm text-slate-700">
                                        This Privacy Policy is governed by the laws of <strong>India</strong>. Legal recourse may be sought before the courts of law in <strong>Lucknow, Uttar Pradesh</strong>.
                                    </p>
                                </div>
                            </div>

                            {/* Final Notice */}
                            <div className="mt-12 p-6 bg-gradient-to-r from-green-600/10 to-[#005081]/10 rounded-xl border border-slate-200">
                                <p className="text-center text-sm text-slate-700">
                                    By using the Lohakart platform, you acknowledge that you have read, understood, and agree to this Privacy Policy. For any privacy-related inquiries, contact us at <a href="mailto:business@lohakart.com" className="text-[#be1800] hover:underline font-semibold">business@lohakart.com</a>
                                </p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
