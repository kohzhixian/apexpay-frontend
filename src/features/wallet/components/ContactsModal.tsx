import { useState } from 'react';

interface Contact {
    id: string;
    name: string;
    handle: string;
    email?: string;
    phone?: string;
    avatar?: string;
    initials?: string;
    avatarColor?: string;
}

interface ContactsModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSelectContact?: (contact: Contact) => void;
}

export const ContactsModal = ({ isOpen, onClose, onSelectContact }: ContactsModalProps) => {
    const [searchQuery, setSearchQuery] = useState('');

    const allContacts: Contact[] = [
        {
            id: '1',
            name: 'Aaron Blake',
            handle: '@aaronblake',
            email: 'aaron.b@example.com',
            initials: 'AB',
            avatarColor: 'bg-indigo-600',
        },
        {
            id: '2',
            name: 'Alice Moore',
            handle: '@alicem',
            email: 'alice.moore@studio.io',
            initials: 'AM',
            avatarColor: 'bg-blue-600',
        },
        {
            id: '3',
            name: 'David Chen',
            handle: '@david_c',
            email: 'david.chen@tech.io',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAzJeOl3dyfgW4tRv9hWshmh0Ji-a9N7FL9i_-o5qt44SH_1vxaTo22CF_AFuuxlduoONbyuD225vNn6A0XbPj7EQsh3IPzmW5eNaCjq-jJ7h00_MB12oXstSHvTkD8LQqqO_ypsDhu-iU2sZTDVv7IT7U6fOhKjBFsdHCPUq6YTvJwcBX683YUl2dC3fHbh3NHCcngUF2RTnudSReefOugCX59XMBdFFZU7xEKSH0E4m0LblDOTcrszDkmFmHl9gULp8cwPib3hg',
        },
        {
            id: '4',
            name: 'Jessica Lee',
            handle: '@jesslee',
            email: 'jessica.l@design.co',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAhRHPRnNlZcsxOH4LQeR8R0i0-u7lvK-hB9YGIEREYjR8M5p4lw2P7xUUu6gM9Zlxh9MVNrPGP6hpZ-CxuThFHwJbb7D6nrjqfnVMPLd6TF5MAWmOJ0bg1TqIjFyZq_vagGigV0xWH1BHzHZGUcshoPDgf50XavXcMFrk2UMXgzdImLmkWbobZwriH23dS8Kc-5KXgkfZQ3K83gUSH3t5doUDqGT1PuMH6Kv12_7SjA0RtvQ-ly-5caNmcGOTsfS86hWHtM4xo5Q',
        },
        {
            id: '5',
            name: 'Mike Taylor',
            handle: '@miket',
            email: 'mike.taylor@biz.net',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDXHiNcZjvPQjsqx5WapClV4DoSK2l52B_0u7BEu_YUD5do6upg0CICOV_miCsbfOCat7OmPwvp6f1QhoftA7n1lAdZNYzjiO8k-Ena9zs-tB86hhu3Lr-4GyqTLw42s0K5fq_HWrUC6gxt4r2yPx87_hCuRT25BX_e4dkU5uaG_-QS6XiJj6NsFBk85ggHS1L9hPTLEuAfh4M_YXDChxtLFVAR9uTv0VtoQBWDSAxPD-uiR4-IcVT4f8bOW-i1ZGDH7PuUGY5aFQ',
        },
        {
            id: '6',
            name: 'Maria West',
            handle: '@maria_w',
            phone: '+1 (555) 987-6543',
            initials: 'MW',
            avatarColor: 'bg-purple-600',
        },
        {
            id: '7',
            name: 'Sarah Connor',
            handle: '@sarahc',
            email: 'sarah.connor@sky.net',
            avatar: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBpYFkk4Ak5iCuwKmOldO-35B7EveBbFxbyGvHauD7ZGZBVWCNDElP41MF4cxbrHnIdNwjFRXnEVACvNOzbmrHUPD3e673XK7jehpr7oIaMo8RTFRldwyw4eGM9LIzmWImJI0OJfC6JqAzdjNBvO7olnDV_KQ70ThbBanXPHA3zfAEkmHIF1RYi7zst-Yaw8Hijdb5mcAHtCpZFolzy3y0HZ6HCD7gwJM54W2LMgmByHmkO6fxVvLdOPznJ2VqQSQ-GHWTmI84T5A',
        },
    ];

    const filteredContacts = allContacts.filter((contact) => {
        const query = searchQuery.toLowerCase();
        return (
            contact.name.toLowerCase().includes(query) ||
            contact.handle.toLowerCase().includes(query) ||
            contact.email?.toLowerCase().includes(query) ||
            contact.phone?.toLowerCase().includes(query)
        );
    });

    const groupedContacts = filteredContacts.reduce((acc, contact) => {
        const firstLetter = contact.name[0].toUpperCase();
        if (!acc[firstLetter]) {
            acc[firstLetter] = [];
        }
        acc[firstLetter].push(contact);
        return acc;
    }, {} as Record<string, Contact[]>);

    const handleContactClick = (contact: Contact) => {
        if (onSelectContact) {
            onSelectContact(contact);
        }
        onClose();
    };

    if (!isOpen) return null;

    const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={handleBackdropClick}
        >
            <div className="relative w-full max-w-lg bg-[#2d3748] rounded-xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden border border-[#304669]">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-[#304669]/50 p-5 bg-[#101723]/40">
                    <h3 className="text-lg font-bold text-white">All Contacts</h3>
                    <button
                        onClick={onClose}
                        className="text-[#8fa6cc] hover:text-white transition-colors p-1 rounded-lg hover:bg-[#304669]/50"
                    >
                        <span className="material-symbols-outlined">close</span>
                    </button>
                </div>

                <div className="p-5 pb-2 bg-[#101723]/20">
                    <div className="relative group">
                        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-[#8fa6cc] group-focus-within:text-primary transition-colors">
                            search
                        </span>
                        <input
                            className="w-full bg-[#0b1019]/60 border border-[#304669] rounded-xl py-3 pl-12 pr-4 text-sm text-white placeholder-[#506385] focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all"
                            placeholder="Search by name, email, or handle..."
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-5 pt-2 space-y-6 custom-scrollbar">
                    {Object.keys(groupedContacts)
                        .sort()
                        .map((letter) => (
                            <div key={letter}>
                                <h4 className="text-xs font-bold text-primary mb-3 uppercase tracking-wider px-2">
                                    {letter}
                                </h4>
                                <div className="space-y-1">
                                    {groupedContacts[letter].map((contact) => (
                                        <button
                                            key={contact.id}
                                            onClick={() => handleContactClick(contact)}
                                            className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#304669]/30 hover:border-[#304669] border border-transparent transition-all group text-left"
                                        >
                                            {contact.avatar ? (
                                                <div
                                                    className="h-10 w-10 rounded-full bg-cover bg-center shrink-0 border border-[#304669]"
                                                    style={{ backgroundImage: `url('${contact.avatar}')` }}
                                                />
                                            ) : (
                                                <div
                                                    className={`h-10 w-10 rounded-full ${contact.avatarColor} flex items-center justify-center text-white text-sm font-bold shrink-0 border border-opacity-30`}
                                                >
                                                    {contact.initials}
                                                </div>
                                            )}
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium text-white group-hover:text-primary transition-colors">
                                                    {contact.name}
                                                </p>
                                                <p className="text-xs text-[#8fa6cc] truncate">
                                                    {contact.handle} • {contact.email || contact.phone}
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </div>
                        ))}

                    {filteredContacts.length === 0 && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <span className="material-symbols-outlined text-[#8fa6cc] text-[48px] mb-3">
                                person_search
                            </span>
                            <p className="text-white font-medium">No contacts found</p>
                            <p className="text-[#8fa6cc] text-sm mt-1">Try a different search term</p>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-5 border-t border-[#304669]/50 bg-[#101723]/60 backdrop-blur-md">
                    <button className="w-full py-3 rounded-xl bg-[#223149] hover:bg-primary text-white text-sm font-semibold transition-all flex items-center justify-center gap-2 group">
                        <span className="material-symbols-outlined text-[20px] group-hover:scale-110 transition-transform">
                            person_add
                        </span>
                        Add New Contact
                    </button>
                </div>
            </div>

            <style>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(48, 70, 105, 0.5);
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background-color: rgba(54, 128, 247, 0.5);
                }
            `}</style>
        </div>
    );
};
