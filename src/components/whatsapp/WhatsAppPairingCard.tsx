import React from 'react';
import { useWhatsAppStatus, useWhatsAppLogout } from '../../services/whatsappService';
import { QrCode, CheckCircle2, RefreshCw, Smartphone, AlertCircle, LogOut } from 'lucide-react';

export const WhatsAppPairingCard: React.FC = () => {
    const { data: status, isLoading, isError, refetch } = useWhatsAppStatus();
    const logoutMutation = useWhatsAppLogout();

    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6 space-y-4">
            <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                    <div className="p-3 bg-green-100 text-green-700 rounded-xl">
                        <Smartphone className="h-6 w-6" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-gray-900 text-base">Automated WhatsApp Integration</h3>
                        <p className="text-xs text-gray-500">
                            Pair your phone to enable 100% free automated background WhatsApp message delivery.
                        </p>
                    </div>
                </div>
                <button
                    onClick={() => refetch()}
                    disabled={isLoading}
                    className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Refresh connection status"
                >
                    <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
                </button>
            </div>

            {isLoading ? (
                <div className="flex items-center justify-center py-6 text-sm text-gray-500">
                    <RefreshCw className="h-5 w-5 animate-spin mr-2 text-green-600" />
                    Checking WhatsApp status...
                </div>
            ) : isError ? (
                <div className="bg-red-50 border border-red-200 p-4 rounded-lg flex items-center gap-3 text-red-700 text-sm">
                    <AlertCircle className="h-5 w-5 shrink-0" />
                    <span>Failed to fetch WhatsApp connection status. Make sure the backend server is running.</span>
                </div>
            ) : status?.isReady ? (
                <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 text-green-800">
                        <CheckCircle2 className="h-6 w-6 text-green-600 shrink-0" />
                        <div>
                            <span className="font-bold text-sm block">WhatsApp Device Linked & Connected</span>
                            <span className="text-xs text-green-700">
                                Background automated WhatsApp messaging is active. Member alerts will send automatically.
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => {
                            if (window.confirm("Are you sure you want to unlink your WhatsApp device from the server?")) {
                                logoutMutation.mutate();
                            }
                        }}
                        disabled={logoutMutation.isPending}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-red-200 hover:bg-red-50 text-red-600 text-xs font-semibold rounded-lg shadow-sm transition-colors shrink-0"
                    >
                        <LogOut className="h-3.5 w-3.5" />
                        <span>{logoutMutation.isPending ? 'Unlinking...' : 'Unlink Device'}</span>
                    </button>
                </div>
            ) : (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 space-y-4">
                    <div className="flex items-center gap-2 text-amber-800 font-semibold text-sm">
                        <QrCode className="h-5 w-5 text-amber-700" />
                        <span>Pair WhatsApp Device via QR Code</span>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 items-center">
                        <div className="space-y-2 text-xs text-amber-950">
                            <p className="font-medium text-sm text-gray-800">Steps to Link Your Phone:</p>
                            <ol className="list-decimal list-inside space-y-1 text-gray-600 leading-relaxed">
                                <li>Open <span className="font-semibold text-gray-800">WhatsApp</span> on your mobile phone.</li>
                                <li>Tap <span className="font-semibold text-gray-800">Menu (⋮)</span> or <span className="font-semibold text-gray-800">Settings</span>.</li>
                                <li>Select <span className="font-semibold text-gray-800">Linked Devices</span> -&gt; <span className="font-semibold text-gray-800">Link a Device</span>.</li>
                                <li>Point your phone camera at the QR code displayed here.</li>
                            </ol>
                            <p className="text-[11px] text-gray-500 pt-2 italic">
                                Note: This page automatically updates once your phone is scanned.
                            </p>
                        </div>

                        <div className="flex flex-col items-center justify-center p-3 bg-white border border-amber-200 rounded-lg shadow-sm">
                            {status?.qrCodeDataUrl ? (
                                <img
                                    src={status.qrCodeDataUrl}
                                    alt="WhatsApp Pairing QR Code"
                                    className="h-44 w-44 object-contain rounded border border-gray-100"
                                />
                            ) : (
                                <div className="h-44 w-44 flex flex-col items-center justify-center text-xs text-gray-400 gap-2">
                                    <RefreshCw className="h-6 w-6 animate-spin text-amber-600" />
                                    <span>Generating QR Code...</span>
                                </div>
                            )}
                            <span className="text-[11px] font-medium text-amber-800 mt-2">
                                {status?.statusMessage || 'Scan QR Code to Pair'}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};
