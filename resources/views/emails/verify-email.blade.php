@component('mail::message')
# Hello!

Please click the button below to verify your email address.

<a href="{!! $url !!}" class="button button-primary" target="_blank" rel="noopener">Verify Email Address</a>

If you did not create an account, no further action is required.

Thanks,<br>
{{ config('app.name') }}

@slot('subcopy')
If you're having trouble clicking the "Verify Email Address" button, copy and paste the URL below
into your web browser: {!! $url !!}
@endslot
@endcomponent
