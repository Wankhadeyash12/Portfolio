import { motion } from 'framer-motion';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import { Menu, X } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' },
  { name: 'Experience', href: '#experience' },
  { name: 'Contact', href: '#contact' },
];

export default function Navbar() {
  return (
    <motion.nav
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 glass-nav"
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          <a href="#home" className="flex items-center gap-3 group">
            <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center text-white font-heading font-bold text-lg shadow-lg group-hover:scale-105 transition-transform">
              YW
            </span>
            <span className="hidden sm:block font-heading font-semibold text-white/90">Yash Wankhade</span>
          </a>

          <div className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                className="px-4 py-2 text-sm text-gray-300 hover:text-accent rounded-lg hover:bg-accent/5 transition-all relative group"
              >
                {link.name}
              </a>
            ))}
          </div>

          <Disclosure as="div" className="md:hidden">
            {({ open }) => (
              <>
                <DisclosureButton className="p-2.5 rounded-lg text-gray-300 hover:text-accent hover:bg-accent/10">
                  {open ? <X size={24} /> : <Menu size={24} />}
                </DisclosureButton>
                <DisclosurePanel className="absolute top-16 left-0 right-0 glass-nav border-b border-border py-4 px-4">
                  {navLinks.map((link) => (
                    <a
                      key={link.name}
                      href={link.href}
                      className="block py-3 px-4 text-gray-300 hover:text-accent hover:bg-accent/5 rounded-lg transition-colors"
                    >
                      {link.name}
                    </a>
                  ))}
                </DisclosurePanel>
              </>
            )}
          </Disclosure>
        </div>
      </div>
    </motion.nav>
  );
}
