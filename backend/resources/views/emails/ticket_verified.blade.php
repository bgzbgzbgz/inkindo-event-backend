<!DOCTYPE html>
<html>
<head>
    <title>Tiket Terverifikasi</title>
</head>
<body>
    <h2>Halo, {{ $registration->user->name }}!</h2>
    <p>Pembayaran Anda untuk event <strong>{{ $registration->event->title ?? 'Event INKINDO' }}</strong> telah berhasil diverifikasi oleh Admin.</p>
    <p>Tiket Anda sekarang sudah aktif. Silakan login ke website dan masuk ke menu <strong>My Ticket</strong> untuk melihat QR Code Anda.</p>
    <br>
    <p>Jangan lupa screenshot atau simpan QR Code tersebut untuk di-scan pada hari H acara.</p>
    <p>Terima kasih!</p>
</body>
</html>